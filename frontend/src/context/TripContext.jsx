import React, { createContext, useContext, useReducer, useCallback } from 'react';
import tripApi from '../services/tripApi';

// Trip Context
const TripContext = createContext();

// Action types
const TRIP_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_TRIPS: 'SET_TRIPS',
  ADD_TRIP: 'ADD_TRIP',
  UPDATE_TRIP: 'UPDATE_TRIP',
  DELETE_TRIP: 'DELETE_TRIP',
  SET_CURRENT_TRIP: 'SET_CURRENT_TRIP',
  SET_TRIP_STATS: 'SET_TRIP_STATS',
  SET_PAGINATION: 'SET_PAGINATION',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Initial state
const initialState = {
  trips: [],
  currentTrip: null,
  tripStats: null,
  loading: false,
  error: null,
  pagination: {
    current_page: 1,
    total_pages: 1,
    total_trips: 0,
    has_next: false,
    has_prev: false,
  },
};

// Reducer function
const tripReducer = (state, action) => {
  switch (action.type) {
    case TRIP_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: action.payload ? null : state.error,
      };

    case TRIP_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case TRIP_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case TRIP_ACTIONS.SET_TRIPS:
      return {
        ...state,
        trips: action.payload,
        loading: false,
        error: null,
      };

    case TRIP_ACTIONS.ADD_TRIP:
      return {
        ...state,
        trips: [action.payload, ...state.trips],
        loading: false,
        error: null,
      };

    case TRIP_ACTIONS.UPDATE_TRIP:
      return {
        ...state,
        trips: state.trips.map(trip =>
          trip.trip_id === action.payload.trip_id ? action.payload : trip
        ),
        currentTrip: state.currentTrip?.trip_id === action.payload.trip_id 
          ? action.payload 
          : state.currentTrip,
        loading: false,
        error: null,
      };

    case TRIP_ACTIONS.DELETE_TRIP:
      return {
        ...state,
        trips: state.trips.filter(trip => trip.trip_id !== action.payload),
        currentTrip: state.currentTrip?.trip_id === action.payload 
          ? null 
          : state.currentTrip,
        loading: false,
        error: null,
      };

    case TRIP_ACTIONS.SET_CURRENT_TRIP:
      return {
        ...state,
        currentTrip: action.payload,
        loading: false,
        error: null,
      };

    case TRIP_ACTIONS.SET_TRIP_STATS:
      return {
        ...state,
        tripStats: action.payload,
        loading: false,
        error: null,
      };

    case TRIP_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: action.payload,
      };

    default:
      return state;
  }
};

// Trip Provider Component
export const TripProvider = ({ children }) => {
  const [state, dispatch] = useReducer(tripReducer, initialState);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: TRIP_ACTIONS.CLEAR_ERROR });
  }, []);

  // Create a new trip
  const createTrip = useCallback(async (tripData) => {
    try {
      dispatch({ type: TRIP_ACTIONS.SET_LOADING, payload: true });
      const response = await tripApi.createTrip(tripData);
      
      if (response.success) {
        dispatch({ type: TRIP_ACTIONS.ADD_TRIP, payload: response.trip });
        return response.trip;
      } else {
        throw new Error(response.message || 'Failed to create trip');
      }
    } catch (error) {
      dispatch({ type: TRIP_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  }, []);

  // Fetch trips with optional filters
  const fetchTrips = useCallback(async (params = {}) => {
    try {
      dispatch({ type: TRIP_ACTIONS.SET_LOADING, payload: true });
      const response = await tripApi.getTrips(params);
      
      if (response.success) {
        dispatch({ type: TRIP_ACTIONS.SET_TRIPS, payload: response.trips });
        if (response.pagination) {
          dispatch({ type: TRIP_ACTIONS.SET_PAGINATION, payload: response.pagination });
        }
        return response.trips;
      } else {
        throw new Error(response.message || 'Failed to fetch trips');
      }
    } catch (error) {
      dispatch({ type: TRIP_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  }, []);

  // Fetch a specific trip by ID
  const fetchTripById = useCallback(async (tripId) => {
    try {
      dispatch({ type: TRIP_ACTIONS.SET_LOADING, payload: true });
      const response = await tripApi.getTripById(tripId);
      
      if (response.success) {
        dispatch({ type: TRIP_ACTIONS.SET_CURRENT_TRIP, payload: response.trip });
        return response.trip;
      } else {
        throw new Error(response.message || 'Failed to fetch trip');
      }
    } catch (error) {
      dispatch({ type: TRIP_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  }, []);

  // Update a trip
  const updateTrip = useCallback(async (tripId, updateData) => {
    try {
      dispatch({ type: TRIP_ACTIONS.SET_LOADING, payload: true });
      const response = await tripApi.updateTrip(tripId, updateData);
      
      if (response.success) {
        dispatch({ type: TRIP_ACTIONS.UPDATE_TRIP, payload: response.trip });
        return response.trip;
      } else {
        throw new Error(response.message || 'Failed to update trip');
      }
    } catch (error) {
      dispatch({ type: TRIP_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  }, []);

  // Delete a trip
  const deleteTrip = useCallback(async (tripId) => {
    try {
      dispatch({ type: TRIP_ACTIONS.SET_LOADING, payload: true });
      const response = await tripApi.deleteTrip(tripId);
      
      if (response.success) {
        dispatch({ type: TRIP_ACTIONS.DELETE_TRIP, payload: tripId });
        return true;
      } else {
        throw new Error(response.message || 'Failed to delete trip');
      }
    } catch (error) {
      dispatch({ type: TRIP_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  }, []);

  // Fetch trip statistics
  const fetchTripStats = useCallback(async () => {
    try {
      dispatch({ type: TRIP_ACTIONS.SET_LOADING, payload: true });
      const response = await tripApi.getTripStats();
      
      if (response.success) {
        dispatch({ type: TRIP_ACTIONS.SET_TRIP_STATS, payload: response.stats });
        return response.stats;
      } else {
        throw new Error(response.message || 'Failed to fetch trip statistics');
      }
    } catch (error) {
      dispatch({ type: TRIP_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  }, []);

  // Set current trip (for navigation/selection)
  const setCurrentTrip = useCallback((trip) => {
    dispatch({ type: TRIP_ACTIONS.SET_CURRENT_TRIP, payload: trip });
  }, []);

  const value = {
    // State
    trips: state.trips,
    currentTrip: state.currentTrip,
    tripStats: state.tripStats,
    loading: state.loading,
    error: state.error,
    pagination: state.pagination,
    
    // Actions
    createTrip,
    fetchTrips,
    fetchTripById,
    updateTrip,
    deleteTrip,
    fetchTripStats,
    setCurrentTrip,
    clearError,
  };

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
};

// Custom hook to use Trip Context
export const useTrips = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrips must be used within a TripProvider');
  }
  return context;
};

export default TripContext;
