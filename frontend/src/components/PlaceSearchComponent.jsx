import React, { useState } from 'react';
import tripApi from '../services/tripApi';

const PlaceSearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showTripForm, setShowTripForm] = useState(false);
  const [tripDetails, setTripDetails] = useState({
    start_date: '',
    end_date: '',
    total_budget: ''
  });

  // Handle search functionality
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError('Please enter a place to search');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await tripApi.searchPlace(searchQuery);
      
      if (response.success) {
        setSearchResults(response.data || []);
        if (response.data.length === 0) {
          setError('No places found for your search');
        }
      } else {
        setError(response.message || 'Failed to search places');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while searching');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle place selection to show trip form
  const handleSelectPlace = (place) => {
    setSelectedPlace(place);
    setShowTripForm(true);
    setError('');
    setSuccessMessage('');
    
    // Set default dates (tomorrow to next week)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    
    setTripDetails({
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      total_budget: ''
    });
  };

  // Handle trip form input changes
  const handleTripDetailChange = (field, value) => {
    setTripDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle saving a trip with all details
  const handleSaveTrip = async (e) => {
    e.preventDefault();
    
    console.log('🚀 Starting trip creation process...');
    console.log('Selected place:', selectedPlace);
    console.log('Trip details:', tripDetails);
    
    if (!tripDetails.start_date || !tripDetails.end_date) {
      setError('Please select both start and end dates');
      return;
    }

    const startDate = new Date(tripDetails.start_date);
    const endDate = new Date(tripDetails.end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate <= today) {
      setError('Start date must be in the future');
      return;
    }

    if (endDate <= startDate) {
      setError('End date must be after start date');
      return;
    }

    const tripData = {
      destination: selectedPlace.name,
      start_date: tripDetails.start_date,
      end_date: tripDetails.end_date,
      place_id: selectedPlace.place_id,
      address: selectedPlace.address,
      coordinates: selectedPlace.coordinates,
      rating: selectedPlace.rating
    };

    if (tripDetails.total_budget && parseFloat(tripDetails.total_budget) > 0) {
      tripData.total_budget = parseFloat(tripDetails.total_budget);
    }

    console.log('📤 Trip data to be sent:', tripData);

    try {
      setIsLoading(true);
      console.log('📡 Calling tripApi.createTrip...');
      const response = await tripApi.createTrip(tripData);
      console.log('📥 Response from server:', response);
      
      if (response.success) {
        setSuccessMessage(`Trip to ${selectedPlace.name} saved successfully!`);
        setSearchResults([]);
        setSearchQuery('');
        setShowTripForm(false);
        setSelectedPlace(null);
        setTripDetails({ start_date: '', end_date: '', total_budget: '' });
      } else {
        console.error('❌ Server returned error:', response.message);
        setError(response.message || 'Failed to save trip');
      }
    } catch (err) {
      console.error('💥 Exception caught:', err);
      setError(err.message || 'An error occurred while saving the trip');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelTripForm = () => {
    setShowTripForm(false);
    setSelectedPlace(null);
    setTripDetails({ start_date: '', end_date: '', total_budget: '' });
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Plan Your Trip with Google Places</h2>
      
      {!showTripForm ? (
        <>
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a destination (e.g., Paris, Tokyo, New York)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !searchQuery.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Search Results</h3>
              {searchResults.map((place, index) => (
                <div key={place.place_id || index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        {place.name}
                      </h4>
                      <p className="text-gray-600 mb-2">
                        📍 {place.address}
                      </p>
                      {place.rating && (
                        <div className="flex items-center mb-2">
                          <span className="text-yellow-500">⭐</span>
                          <span className="ml-1 text-gray-700">{place.rating.toFixed(1)}</span>
                        </div>
                      )}
                      <p className="text-sm text-gray-500">
                        📍 {place.coordinates.lat.toFixed(6)}, {place.coordinates.lng.toFixed(6)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleSelectPlace(place)}
                      disabled={isLoading}
                      className="ml-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      Select Place
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* Trip Details Form */
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Plan Your Trip to {selectedPlace.name}
          </h3>
          
          <div className="bg-white p-4 rounded-md mb-4">
            <h4 className="font-medium text-gray-900 mb-2">{selectedPlace.name}</h4>
            <p className="text-gray-600 text-sm mb-1">📍 {selectedPlace.address}</p>
            {selectedPlace.rating && (
              <div className="flex items-center">
                <span className="text-yellow-500">⭐</span>
                <span className="ml-1 text-gray-700 text-sm">{selectedPlace.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSaveTrip} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={tripDetails.start_date}
                  onChange={(e) => handleTripDetailChange('start_date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={tripDetails.end_date}
                  onChange={(e) => handleTripDetailChange('end_date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget (Optional)
              </label>
              <input
                type="number"
                value={tripDetails.total_budget}
                onChange={(e) => handleTripDetailChange('total_budget', e.target.value)}
                placeholder="Enter your budget"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                min="0"
                step="0.01"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Saving Trip...' : 'Save Trip'}
              </button>
              <button
                type="button"
                onClick={handleCancelTripForm}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}

      {/* Loading State */}
      {isLoading && !showTripForm && searchResults.length === 0 && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Searching places...</p>
        </div>
      )}
    </div>
  );
};

export default PlaceSearchComponent;