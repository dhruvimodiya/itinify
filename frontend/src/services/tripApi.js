const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/trips`;

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create headers with auth token
const createHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Trip API service
const tripApi = {
  /**
   * Create a new trip
   * @param {Object} tripData - Trip data {destination, start_date, end_date, total_budget?}
   * @returns {Promise<Object>} Created trip data
   */
  createTrip: async (tripData) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(tripData),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error creating trip:', error);
      throw error;
    }
  },

  /**
   * Get all trips for the authenticated user
   * @param {Object} params - Query parameters {status?, page?, limit?, sort?}
   * @returns {Promise<Object>} Trips list with pagination
   */
  getTrips: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add query parameters if provided
      if (params.status) queryParams.append('status', params.status);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.sort) queryParams.append('sort', params.sort);
      
      const url = queryParams.toString() 
        ? `${API_BASE_URL}?${queryParams.toString()}`
        : API_BASE_URL;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: createHeaders(),
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching trips:', error);
      throw error;
    }
  },

  /**
   * Get a specific trip by ID
   * @param {string} tripId - Trip ID
   * @returns {Promise<Object>} Trip data
   */
  getTripById: async (tripId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${tripId}`, {
        method: 'GET',
        headers: createHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching trip:', error);
      throw error;
    }
  },

  /**
   * Update an existing trip
   * @param {string} tripId - Trip ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated trip data
   */
  updateTrip: async (tripId, updateData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${tripId}`, {
        method: 'PUT',
        headers: createHeaders(),
        body: JSON.stringify(updateData),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error updating trip:', error);
      throw error;
    }
  },

  /**
   * Delete a trip
   * @param {string} tripId - Trip ID
   * @returns {Promise<Object>} Success message
   */
  deleteTrip: async (tripId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${tripId}`, {
        method: 'DELETE',
        headers: createHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error deleting trip:', error);
      throw error;
    }
  },

  /**
   * Get trip statistics for the authenticated user
   * @returns {Promise<Object>} Trip statistics
   */
  getTripStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`, {
        method: 'GET',
        headers: createHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching trip stats:', error);
      throw error;
    }
  },
};

export default tripApi;
