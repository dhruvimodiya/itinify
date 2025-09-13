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

  const generateBudgetSuggestions = () => {
    const duration = calculateDuration();
    const suggestions = [
      { label: 'Budget', amount: duration * 100, description: 'Basic accommodation & meals' },
      { label: 'Comfort', amount: duration * 200, description: 'Mid-range hotels & dining' },
      { label: 'Luxury', amount: duration * 400, description: 'Premium experiences' }
    ];
    setBudgetSuggestions(suggestions);
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

  const popularDestinations = [
    'Paris, France', 'Tokyo, Japan', 'New York, USA', 'London, UK',
    'Bali, Indonesia', 'Barcelona, Spain', 'Sydney, Australia', 'Dubai, UAE'
  ];

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
              <div className="relative">
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  placeholder="Enter your dream destination..."
                  className={`w-full px-4 py-4 bg-white/80 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                    validationErrors.destination
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-amber-200 focus:border-amber-500'
                  }`}
                />
                <Globe className="absolute right-4 top-1/2 transform -translate-y-1/2 text-amber-600 w-5 h-5" />
              </div>
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
                      onClick={() => setFormData(prev => ({ ...prev, destination: dest }))}
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
