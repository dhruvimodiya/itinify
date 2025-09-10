import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import ItineraryManager from '../components/ItineraryManager';
import tripApi from '../services/tripApi';
import LoadingSpinner from '../components/LoadingSpinner';

const ItineraryPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (tripId) {
      fetchTrip();
    }
  }, [tripId]);

  const fetchTrip = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching trip with ID:', tripId);
      
      if (!tripId) {
        throw new Error('No trip ID provided');
      }
      
      const response = await tripApi.getTripById(tripId);
      console.log('Trip response:', response);
      
      if (response && response.trip) {
        setTrip(response.trip);
      } else {
        throw new Error('Trip data not found in response');
      }
    } catch (error) {
      console.error('Error fetching trip:', error);
      setError(error.message || 'Failed to load trip');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToTrips = () => {
    navigate('/trips');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    // Create a demo trip for testing purposes
    const demoTrip = {
      trip_id: tripId,
      destination: 'Demo Destination - Paris, France',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      total_budget: 2000,
      duration_days: 7
    };

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Demo Warning Banner */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Demo Mode:</strong> Trip not found, but showing demo interface for testing purposes. 
                <span className="font-medium"> Error: {error}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <button
                onClick={handleBackToTrips}
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <IoArrowBack className="h-5 w-5 mr-2" />
                Back to Trips
              </button>
              
              <div className="text-center flex-1 mx-8">
                <h1 className="text-2xl font-bold text-gray-900">{demoTrip.destination}</h1>
                <p className="text-sm text-gray-600 mt-1">
                  {formatDate(demoTrip.start_date)} - {formatDate(demoTrip.end_date)} • {demoTrip.duration_days} days
                </p>
              </div>
              
              <div className="w-32"></div> {/* Spacer for centering */}
            </div>
          </div>
        </div>

        {/* Demo Itinerary Manager */}
        <ItineraryManager tripId={tripId} trip={demoTrip} />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Trip not found</h3>
          <button
            onClick={handleBackToTrips}
            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <IoArrowBack className="h-4 w-4 mr-2" />
            Back to Trips
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={handleBackToTrips}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <IoArrowBack className="h-5 w-5 mr-2" />
              Back to Trips
            </button>
            
            <div className="text-center flex-1 mx-8">
              <h1 className="text-2xl font-bold text-gray-900">{trip.destination}</h1>
              <p className="text-sm text-gray-600 mt-1">
                {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
              </p>
            </div>
            
            <div className="text-right">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                trip.status === 'upcoming' 
                  ? 'bg-blue-100 text-blue-800'
                  : trip.status === 'ongoing'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {trip.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-6">
        <ItineraryManager tripId={tripId} trip={trip} />
      </main>
    </div>
  );
};

export default ItineraryPage;
