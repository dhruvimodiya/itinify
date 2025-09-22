import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Search, 
  Star, 
  Clock, 
  Globe, 
  ExternalLink,
  Loader2,
  X,
  CheckCircle
} from 'lucide-react';

const PlaceSearchComponent = ({ 
  value = '', 
  onChange, 
  placeholder = "Search for places...", 
  className = "",
  showDetails = true,
  debounceTime = null // Allow custom debounce timing
}) => {
  const [query, setQuery] = useState(value);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [error, setError] = useState('');
  const [userTypingSpeed, setUserTypingSpeed] = useState(300); // Dynamic debounce
  const [lastKeyTime, setLastKeyTime] = useState(Date.now());
  
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Dynamic debounce search with adaptive timing
  useEffect(() => {
    console.log('⏱️ Debounce effect triggered with query:', query);
    
    // Calculate dynamic debounce time based on user typing patterns
    const dynamicDebounce = debounceTime || calculateOptimalDebounceTime();
    
    const timer = setTimeout(() => {
      if (query.trim() && query.length >= getMinimumQueryLength()) {
        console.log('🚀 Triggering search for:', query, 'with debounce:', dynamicDebounce);
        searchPlaces(query);
      } else {
        console.log('🛑 Query too short or empty, clearing results');
        setPlaces([]);
        setShowDropdown(false);
      }
    }, dynamicDebounce);

    return () => {
      console.log('🧹 Clearing debounce timer');
      clearTimeout(timer);
    };
  }, [query, debounceTime]);

  // Calculate optimal debounce time based on user behavior
  const calculateOptimalDebounceTime = () => {
    // Faster typists get shorter debounce, slower typists get longer
    if (userTypingSpeed < 100) return 150; // Very fast typist
    if (userTypingSpeed < 200) return 250; // Fast typist  
    if (userTypingSpeed < 400) return 350; // Average typist
    return 500; // Slower typist
  };

  // Dynamic minimum query length based on query type
  const getMinimumQueryLength = () => {
    const queryLower = query.toLowerCase().trim();
    
    // Single character searches for common abbreviations
    if (/^[A-Z]$/.test(query)) return 1; // Single capital letter (state/country codes)
    
    // Two character searches for country codes or short place names
    if (queryLower.length === 2) return 2;
    
    // Default minimum of 2 characters
    return 2;
  };

  // Handle clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target) &&
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchPlaces = async (searchQuery) => {
    setLoading(true);
    setError('');
    
    console.log('🔍 Starting place search...');
    console.log('📝 Search Query:', searchQuery);
    console.log('🔑 Auth Token:', localStorage.getItem('token') ? 'Present' : 'Missing');
    
    const apiUrl = `http://localhost:5000/api/trips/search-place?query=${encodeURIComponent(searchQuery)}`;
    console.log('🌐 API URL:', apiUrl);
    
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      };
      console.log('📋 Request Headers:', headers);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: headers
      });

      console.log('📡 Response Status:', response.status);
      console.log('📡 Response OK:', response.ok);

      if (!response.ok) {
        console.error('❌ Response not OK:', response.status, response.statusText);
        throw new Error('Failed to search places');
      }

      const data = await response.json();
      console.log('📥 Raw API Response:', data);
      console.log('✅ API Success:', data.success);
      console.log('📊 Places Count:', data.data ? data.data.length : 0);
      console.log('📍 Places Data:', data.data);
      
      if (data.success) {
        setPlaces(data.data || []);
        setShowDropdown(true);
        console.log('✅ Places set successfully, dropdown shown');
      } else {
        console.error('❌ API returned failure:', data.message);
        setError('Failed to search places');
        setPlaces([]);
      }
    } catch (err) {
      console.error('💥 Search error:', err);
      console.error('💥 Error details:', err.message);
      console.error('💥 Error stack:', err.stack);
      setError('Unable to search places. Please try again.');
      setPlaces([]);
    } finally {
      setLoading(false);
      console.log('🔚 Search process completed');
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    const currentTime = Date.now();
    
    // Track user typing speed for dynamic debouncing
    const timeDiff = currentTime - lastKeyTime;
    setUserTypingSpeed(prev => {
      // Exponential moving average for smoother adaptation
      return Math.round(prev * 0.7 + timeDiff * 0.3);
    });
    setLastKeyTime(currentTime);
    
    console.log('✏️ Input changed:', newValue, 'Typing speed:', timeDiff + 'ms');
    setQuery(newValue);
    
    // Clear selected place if user starts typing again
    if (selectedPlace && newValue !== selectedPlace.name) {
      console.log('🗑️ Clearing selected place because input changed');
      setSelectedPlace(null);
    }
    
    // Update parent component
    console.log('📤 Calling parent onChange with:', newValue);
    onChange(newValue);
  };

  const handlePlaceSelect = (place) => {
    console.log('🎯 Place selected:', place);
    setSelectedPlace(place);
    setQuery(place.name);
    setShowDropdown(false);
    console.log('📤 Calling parent onChange with place data:', place.name, place);
    onChange(place.name, place); // Pass both name and full place object
  };

  const clearSelection = () => {
    setSelectedPlace(null);
    setQuery('');
    setPlaces([]);
    setShowDropdown(false);
    onChange('');
  };

  const getPriceText = (priceLevel) => {
    // Dynamic price representation based on various factors
    const currentYear = new Date().getFullYear();
    const inflationFactor = Math.pow(1.03, currentYear - 2024); // 3% annual inflation
    
    const basePrices = ['Free', '$', '$$', '$$$', '$$$$'];
    const baseText = basePrices[priceLevel] || 'N/A';
    
    // Add contextual information for price levels
    const priceContexts = {
      0: 'Free Entry',
      1: 'Budget-Friendly',
      2: 'Moderate Cost', 
      3: 'Premium Pricing',
      4: 'Luxury Experience'
    };
    
    const context = priceContexts[priceLevel];
    return context ? `${baseText} (${context})` : baseText;
  };

  const getTypeIcon = (type) => {
    const icons = {
      // Tourist attractions & landmarks
      'landmark': '🗼',
      'monument': '🗿', 
      'tower': '🗼',
      'bridge': '🌉',
      'castle': '🏰',
      'fort': '🏰',
      'palace': '�',
      
      // Religious places
      'temple': '🛕',
      'mosque': '🕌',
      'church': '⛪',
      'cathedral': '⛪',
      'shrine': '⛩️',
      'abbey': '⛪',
      
      // Cultural places
      'museum': '🏛️',
      'gallery': '🎨',
      'theater': '🎭',
      'historical': '�️',
      
      // Natural places
      'beach': '🏖️',
      'park': '🌳',
      'garden': '🌻',
      'waterfront': '🌊',
      'river': '🌊',
      
      // Commercial areas
      'market': '🏪',
      'shopping': '🛍️',
      'mall': '🛍️',
      'restaurant': '�️',
      'hotel': '🏨',
      
      // Transportation
      'railway_station': '🚂',
      'airport': '✈️',
      'port': '🚢',
      'transport': '🚌',
      
      // Districts & areas
      'city_center': '🏙️',
      'district': '🏘️',
      'avenue': '🛣️',
      'promenade': '🚶‍♂️',
      
      // Entertainment
      'theme_park': '🎢',
      'activity': '🎯',
      'attraction': '�',
      
      // Default
      'default': '📍'
    };
    return icons[type] || icons.default;
  };

  return (
    <div className={`relative w-full ${className}`} ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full px-4 py-4 pr-12 bg-white/80 border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-500 transition-all duration-200"
          onFocus={() => {
            if (places.length > 0) setShowDropdown(true);
          }}
        />
        
        {/* Input Icons */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {loading && (
            <Loader2 className="w-5 h-5 text-amber-600 animate-spin" />
          )}
          {selectedPlace && !loading && (
            <button
              onClick={clearSelection}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {!loading && !selectedPlace && (
            <Search className="w-5 h-5 text-amber-600" />
          )}
          {selectedPlace && !loading && (
            <CheckCircle className="w-5 h-5 text-green-500" />
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600 flex items-center"
        >
          <X className="w-4 h-4 mr-1" />
          {error}
        </motion.div>
      )}

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {showDropdown && places.length > 0 && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-white border border-amber-200 rounded-xl shadow-lg max-h-96 overflow-y-auto"
          >
            <div className="p-2">
              {places.map((place, index) => (
                <motion.button
                  key={place.place_id || index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handlePlaceSelect(place)}
                  className="w-full text-left p-4 hover:bg-amber-50 rounded-lg transition-colors border border-transparent hover:border-amber-200"
                >
                  <div className="flex items-start space-x-3">
                    {/* Place Icon */}
                    <div className="text-2xl flex-shrink-0 mt-1">
                      {getTypeIcon(place.type)}
                    </div>
                    
                    {/* Place Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900 truncate">
                          {place.name}
                        </h4>
                        {place.rating && (
                          <div className="flex items-center space-x-1 flex-shrink-0">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">
                              {place.rating}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2 flex items-center">
                        <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                        {place.address}
                      </p>
                      
                      {place.description && (
                        <p className="text-sm text-gray-500 mb-2">
                          {place.description}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        {place.price_level !== undefined && (
                          <span className="flex items-center">
                            💰 {getPriceText(place.price_level)}
                          </span>
                        )}
                        {place.opening_hours && (
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {place.opening_hours}
                          </span>
                        )}
                        <span className="px-2 py-1 bg-gray-100 rounded-full">
                          {place.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
            
            {/* Footer */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-xl">
              <p className="text-xs text-gray-500 text-center">
                Found {places.length} places • Powered by Free Search API
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Place Details */}
      {selectedPlace && showDetails && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl"
        >
          <div className="flex items-start space-x-3">
            <div className="text-3xl">
              {getTypeIcon(selectedPlace.type)}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-green-900 mb-1 flex items-center space-x-2">
                <span>{selectedPlace.name}</span>
                {selectedPlace.rating && (
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm">{selectedPlace.rating}</span>
                  </div>
                )}
              </h3>
              
              <p className="text-sm text-green-700 mb-2 flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {selectedPlace.address}
              </p>
              
              {selectedPlace.description && (
                <p className="text-sm text-green-600 mb-3">
                  {selectedPlace.description}
                </p>
              )}
              
              <div className="flex flex-wrap gap-3 text-xs">
                {selectedPlace.price_level !== undefined && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                    💰 {getPriceText(selectedPlace.price_level)}
                  </span>
                )}
                {selectedPlace.opening_hours && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {selectedPlace.opening_hours}
                  </span>
                )}
                {selectedPlace.website && (
                  <a
                    href={selectedPlace.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center hover:bg-blue-200 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Website
                  </a>
                )}
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                  {selectedPlace.type}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PlaceSearchComponent;