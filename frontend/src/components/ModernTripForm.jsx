import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Save, 
  X, 
  AlertCircle,
  Sparkles,
  Globe,
  Clock,
  TrendingUp,
  Compass,
  Mountain,
  TreePine,
  Backpack,
  Map,
  Plane
} from 'lucide-react';
import { useTrips } from '../context/TripContext';
import PlaceSearchComponent from './PlaceSearchComponent';

const ModernTripForm = ({ trip = null, onSuccess, onCancel, isModal = false }) => {
  const { createTrip, updateTrip, loading, error, clearError } = useTrips();
  
  const [formData, setFormData] = useState({
    destination: '',
    start_date: '',
    end_date: '',
    total_budget: '',
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [isAIAssisting, setIsAIAssisting] = useState(false);
  const [budgetSuggestions, setBudgetSuggestions] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [popularDestinations, setPopularDestinations] = useState([]);

  // Initialize form data if editing existing trip
  useEffect(() => {
    if (trip) {
      setFormData({
        destination: trip.destination || '',
        start_date: trip.start_date ? trip.start_date.split('T')[0] : '',
        end_date: trip.end_date ? trip.end_date.split('T')[0] : '',
        total_budget: trip.total_budget || '',
      });
    }
  }, [trip]);

  // Clear errors when form data changes
  useEffect(() => {
    if (error) clearError();
    if (Object.keys(validationErrors).length > 0) setValidationErrors({});
  }, [formData, error, clearError, validationErrors]);

  // AI Budget suggestions based on destination
  useEffect(() => {
    if (formData.destination && formData.start_date && formData.end_date) {
      generateBudgetSuggestions();
    }
  }, [formData.destination, formData.start_date, formData.end_date]);

  // Initialize dynamic popular destinations
  useEffect(() => {
    loadPopularDestinations();
  }, []);

  // Dynamic popular destinations based on current trends, user data, or API
  const loadPopularDestinations = async () => {
    try {
      // Option 1: Fetch from backend API (recommended)
      // const response = await fetch('/api/destinations/popular');
      // const data = await response.json();
      // setPopularDestinations(data.destinations || []);
      
      // Option 2: Generate based on user's location, season, or trends
      const dynamicDestinations = generateContextualDestinations();
      setPopularDestinations(dynamicDestinations);
    } catch (error) {
      console.log('Using fallback destinations');
      setPopularDestinations(generateFallbackDestinations());
    }
  };

  // Generate contextual destinations based on current context
  const generateContextualDestinations = () => {
    const currentMonth = new Date().getMonth();
    const currentSeason = getSeason(currentMonth);
    const userLanguage = navigator.language || 'en-US';
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Generate destinations based on season, location, and trends
    const seasonalDestinations = getSeasonalDestinations(currentSeason);
    const regionalDestinations = getRegionalDestinations(userTimezone);
    const trendingDestinations = getTrendingDestinations();
    
    // Combine and randomize
    const allDestinations = [...seasonalDestinations, ...regionalDestinations, ...trendingDestinations];
    return shuffleArray(allDestinations).slice(0, 8);
  };

  // Get seasonal destination suggestions
  const getSeasonalDestinations = (season) => {
    const seasonalMap = {
      'winter': ['Dubai, UAE', 'Thailand', 'Goa, India', 'Singapore'],
      'spring': ['Japan', 'Netherlands', 'Turkey', 'Nepal'],
      'summer': ['Europe', 'Scandinavia', 'Canada', 'Russia'],
      'autumn': ['New England, USA', 'Germany', 'South Korea', 'China']
    };
    return seasonalMap[season] || [];
  };

  // Get regional destinations based on timezone
  const getRegionalDestinations = (timezone) => {
    if (timezone.includes('Asia')) {
      return ['Southeast Asia', 'Japan', 'South Korea', 'Indonesia'];
    } else if (timezone.includes('Europe')) {
      return ['Mediterranean', 'Scandinavia', 'Eastern Europe', 'UK'];
    } else if (timezone.includes('America')) {
      return ['Central America', 'South America', 'Caribbean', 'Canada'];
    }
    return ['Australia', 'New Zealand', 'Pacific Islands', 'Africa'];
  };

  // Get currently trending destinations (could be from API)
  const getTrendingDestinations = () => {
    const trending = [
      'Portugal', 'Georgia', 'Vietnam', 'Morocco',
      'Peru', 'Iceland', 'Sri Lanka', 'Jordan'
    ];
    return shuffleArray(trending).slice(0, 4);
  };

  // Generate fallback destinations if all else fails
  const generateFallbackDestinations = () => {
    const fallbacks = [
      'Local Destination', 'Nearby City', 'Regional Capital',
      'National Park', 'Historical Site', 'Cultural Center'
    ];
    return fallbacks;
  };

  // Utility functions
  const getSeason = (month) => {
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Dynamic budget suggestions based on destination data and current rates
  const generateBudgetSuggestions = () => {
    const duration = calculateDuration();
    if (duration <= 0) return;

    // Get dynamic base cost based on destination and selected place data
    const baseCost = calculateBaseCost();
    
    const suggestions = [
      { 
        label: 'Budget', 
        amount: Math.round(duration * baseCost * 0.8), 
        description: 'Basic accommodation & local transport' 
      },
      { 
        label: 'Comfort', 
        amount: Math.round(duration * baseCost * 1.5), 
        description: 'Mid-range hotels & comfortable travel' 
      },
      { 
        label: 'Luxury', 
        amount: Math.round(duration * baseCost * 3.0), 
        description: 'Premium experiences & luxury stays' 
      }
    ];
    setBudgetSuggestions(suggestions);
  };

  // Calculate base cost per day based on destination and place data
  const calculateBaseCost = () => {
    let baseCost = 100; // Default base cost per day
    
    // Adjust based on selected place data
    if (selectedPlace) {
      // Use place price level to adjust base cost
      const priceLevelMultipliers = [0.5, 1.0, 1.5, 2.0, 3.0]; // For price levels 0-4
      const multiplier = priceLevelMultipliers[selectedPlace.price_level] || 1.0;
      baseCost = Math.round(baseCost * multiplier);
      
      // Adjust based on place type
      const typeMultipliers = {
        'country': 0.8,
        'city_center': 1.3,
        'luxury': 2.0,
        'resort': 2.5,
        'hotel': 1.2,
        'beach': 1.1,
        'mountain': 0.9,
        'rural': 0.7
      };
      
      if (selectedPlace.type && typeMultipliers[selectedPlace.type]) {
        baseCost = Math.round(baseCost * typeMultipliers[selectedPlace.type]);
      }
    }
    
    // Adjust based on destination region (from form data)
    const destination = formData.destination.toLowerCase();
    if (destination.includes('europe') || destination.includes('switzerland') || destination.includes('norway')) {
      baseCost = Math.round(baseCost * 1.8);
    } else if (destination.includes('asia') || destination.includes('india') || destination.includes('thailand')) {
      baseCost = Math.round(baseCost * 0.6);
    } else if (destination.includes('america') || destination.includes('usa') || destination.includes('canada')) {
      baseCost = Math.round(baseCost * 1.4);
    }
    
    return Math.max(50, baseCost); // Minimum $50 per day
  };

  const calculateDuration = () => {
    if (!formData.start_date || !formData.end_date) return 0;
    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDestinationChange = (destinationName, placeData = null) => {
    console.log('🏠 ModernTripForm - Destination changed:', destinationName);
    console.log('📍 ModernTripForm - Place data received:', placeData);
    
    setFormData(prev => ({
      ...prev,
      destination: destinationName,
    }));
    setSelectedPlace(placeData);
    
    console.log('✅ ModernTripForm - State updated, selectedPlace:', placeData);
  };

  const validateForm = () => {
    const errors = {};
    const today = new Date().toISOString().split('T')[0];

    // Destination validation
    if (!formData.destination.trim()) {
      errors.destination = 'Destination is required';
    } else if (formData.destination.length > 255) {
      errors.destination = 'Destination must be less than 255 characters';
    }

    // Start date validation
    if (!formData.start_date) {
      errors.start_date = 'Start date is required';
    } else if (!trip && formData.start_date < today) {
      errors.start_date = 'Start date cannot be in the past';
    }

    // End date validation
    if (!formData.end_date) {
      errors.end_date = 'End date is required';
    } else if (formData.start_date && formData.end_date < formData.start_date) {
      errors.end_date = 'End date must be after start date';
    }

    // Budget validation
    if (formData.total_budget && parseFloat(formData.total_budget) < 0) {
      errors.total_budget = 'Budget must be a positive number';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const tripData = {
        ...formData,
        total_budget: formData.total_budget ? parseFloat(formData.total_budget) : null,
      };

      // Add place-specific data if available
      if (selectedPlace) {
        tripData.place_id = selectedPlace.place_id;
        tripData.address = selectedPlace.address;
        tripData.coordinates = selectedPlace.coordinates;
        tripData.rating = selectedPlace.rating;
        tripData.place_type = selectedPlace.type;
      }

      if (trip) {
        await updateTrip(trip.trip_id, tripData);
      } else {
        await createTrip(tripData);
      }

      onSuccess && onSuccess();
    } catch (error) {
      console.error('Error saving trip:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-4xl mx-auto"
      style={{
        background: 'linear-gradient(135deg, #f5f1eb 0%, #ede3d3 50%, #e8dcc6 100%)',
        borderRadius: '24px',
        padding: '2rem'
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full mb-4 shadow-lg">
            <Map className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-amber-900 mb-2 flex items-center justify-center gap-3">
            <Compass className="w-8 h-8 text-amber-600" />
            {trip ? 'Edit Your Journey' : 'Plan Your Adventure'}
            <Mountain className="w-8 h-8 text-amber-600" />
          </h2>
          <p className="text-amber-800 max-w-2xl mx-auto">
            {trip 
              ? 'Update your trip details and make it even better'
              : 'Tell us about your dream destination and let us help you plan the perfect journey'
            }
          </p>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div 
            variants={itemVariants}
            className="bg-red-50 border border-red-300 rounded-xl p-4 flex items-center space-x-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-red-800">Error</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Destination */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-amber-900 mb-3">
                <MapPin className="inline w-4 h-4 mr-2" />
                Where are you going?
              </label>
              
              <PlaceSearchComponent
                value={formData.destination}
                onChange={handleDestinationChange}
                placeholder="Enter your dream destination..."
                className={validationErrors.destination ? 'border-red-300' : ''}
                showDetails={false}
              />
              
              {validationErrors.destination && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {validationErrors.destination}
                </p>
              )}
              
              {/* Popular Destinations */}
              <div className="mt-4">
                <p className="text-sm text-amber-800 mb-3 flex items-center gap-2">
                  <TreePine className="w-4 h-4" />
                  Popular destinations:
                </p>
                <div className="flex flex-wrap gap-2">
                  {popularDestinations.map((dest) => (
                    <button
                      key={dest}
                      type="button"
                      onClick={() => handleDestinationChange(dest)}
                      className="px-3 py-1 text-sm bg-amber-100 text-amber-800 rounded-full hover:bg-amber-200 transition-colors border border-amber-300"
                    >
                      {dest}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Dates */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-amber-900 mb-3">
                  <Calendar className="inline w-4 h-4 mr-2" />
                  Start Date
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-4 bg-white/80 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                    validationErrors.start_date
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-amber-200 focus:border-amber-500'
                  }`}
                />
                {validationErrors.start_date && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {validationErrors.start_date}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-amber-900 mb-3">
                  <Calendar className="inline w-4 h-4 mr-2" />
                  End Date
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-4 bg-white/80 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                    validationErrors.end_date
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-amber-200 focus:border-amber-500'
                  }`}
                />
                {validationErrors.end_date && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {validationErrors.end_date}
                  </p>
                )}
              </div>
            </motion.div>

            {/* Duration Display */}
            {formData.start_date && formData.end_date && (
              <motion.div 
                variants={itemVariants}
                className="bg-amber-50 border border-amber-200 rounded-xl p-4"
              >
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="font-semibold text-amber-900 flex items-center gap-2">
                      <Backpack className="w-4 h-4" />
                      Trip Duration
                    </p>
                    <p className="text-sm text-amber-700">
                      {calculateDuration()} {calculateDuration() === 1 ? 'day' : 'days'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Budget */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-amber-900 mb-3">
                <DollarSign className="inline w-4 h-4 mr-2" />
                Budget (Optional)
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="total_budget"
                  value={formData.total_budget}
                  onChange={handleInputChange}
                  placeholder="Enter your budget..."
                  className={`w-full px-4 py-4 bg-white/80 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                    validationErrors.total_budget
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-amber-200 focus:border-amber-500'
                  }`}
                />
                <TrendingUp className="absolute right-4 top-1/2 transform -translate-y-1/2 text-amber-600 w-5 h-5" />
              </div>
              {validationErrors.total_budget && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {validationErrors.total_budget}
                </p>
              )}
            </motion.div>

            {/* Budget Suggestions */}
            {budgetSuggestions.length > 0 && (
              <motion.div variants={itemVariants}>
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                    <h4 className="font-semibold text-amber-900 flex items-center gap-2">
                      <Plane className="w-4 h-4" />
                      AI Budget Suggestions
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {budgetSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, total_budget: suggestion.amount.toString() }))}
                        className="w-full text-left p-4 bg-white/70 rounded-lg hover:bg-white/90 transition-all duration-200 border border-amber-300/50"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-amber-900">{suggestion.label}</span>
                          <span className="font-bold text-amber-700">${suggestion.amount.toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-amber-800">{suggestion.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Selected Place Details */}
            {selectedPlace && (
              <motion.div variants={itemVariants}>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                  <h4 className="font-semibold text-amber-900 mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    Selected Destination Details
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-amber-800">Place Name:</span>
                      <span className="font-medium text-amber-900">{selectedPlace.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-800">Address:</span>
                      <span className="font-medium text-amber-900 text-right max-w-xs truncate">{selectedPlace.address}</span>
                    </div>
                    {selectedPlace.rating && (
                      <div className="flex justify-between">
                        <span className="text-amber-800">Rating:</span>
                        <span className="font-medium text-amber-900 flex items-center gap-1">
                          ⭐ {selectedPlace.rating}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-amber-800">Type:</span>
                      <span className="font-medium text-amber-900 capitalize">{selectedPlace.type}</span>
                    </div>
                    {selectedPlace.coordinates && (
                      <div className="flex justify-between">
                        <span className="text-amber-800">Coordinates:</span>
                        <span className="font-medium text-blue-700 text-sm">
                          {selectedPlace.coordinates.lat.toFixed(4)}, {selectedPlace.coordinates.lng.toFixed(4)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Trip Summary */}
            {formData.destination && formData.start_date && formData.end_date && (
              <motion.div variants={itemVariants}>
                <div className="bg-gradient-to-br from-emerald-50 to-stone-50 border border-emerald-200 rounded-xl p-6">
                  <h4 className="font-semibold text-amber-900 mb-4 flex items-center gap-2">
                    <Mountain className="w-5 h-5 text-emerald-600" />
                    Trip Summary
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-amber-800">Destination:</span>
                      <span className="font-medium text-amber-900">{formData.destination}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-800">Duration:</span>
                      <span className="font-medium text-amber-900">{calculateDuration()} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-800">Start Date:</span>
                      <span className="font-medium text-amber-900">
                        {new Date(formData.start_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-800">End Date:</span>
                      <span className="font-medium text-amber-900">
                        {new Date(formData.end_date).toLocaleDateString()}
                      </span>
                    </div>
                    {formData.total_budget && (
                      <div className="flex justify-between pt-3 border-t border-emerald-200">
                        <span className="text-amber-800">Budget:</span>
                        <span className="font-bold text-emerald-700">
                          ${parseFloat(formData.total_budget).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-8">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-4 border-2 border-amber-300 text-amber-800 rounded-xl font-semibold hover:bg-amber-50 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-semibold hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>{trip ? 'Update Journey' : 'Create Journey'}</span>
              </>
            )}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default ModernTripForm;
