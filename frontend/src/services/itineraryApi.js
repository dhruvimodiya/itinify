const API_BASE_URL = 'http://localhost:5000/api/itinerary';

// Helper function to get auth headers
const createHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Helper function to handle responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }
  
  return data;
};

export const itineraryApi = {
  /**
   * Create a new itinerary item
   * @param {Object} itineraryData - The itinerary item data
   * @returns {Promise<Object>} Created itinerary item
   */
  createItinerary: async (itineraryData) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(itineraryData),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error creating itinerary item:', error);
      throw error;
    }
  },

  /**
   * Create multiple itinerary items at once
   * @param {Object} data - {trip_id, items: []}
   * @returns {Promise<Object>} Created itinerary items
   */
  bulkCreateItinerary: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bulk`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(data),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error bulk creating itinerary items:', error);
      throw error;
    }
  },

  /**
   * Get all itinerary items for a trip
   * @param {string} tripId - Trip ID
   * @param {Object} params - Query parameters {day?, category?, completed?}
   * @returns {Promise<Object>} Trip itinerary data
   */
  getTripItinerary: async (tripId, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.day) queryParams.append('day', params.day.toString());
      if (params.category) queryParams.append('category', params.category);
      if (params.completed !== undefined) queryParams.append('completed', params.completed.toString());
      
      const url = `${API_BASE_URL}/trip/${tripId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: createHeaders(),
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching trip itinerary:', error);
      throw error;
    }
  },

  /**
   * Get itinerary summary for a trip
   * @param {string} tripId - Trip ID
   * @returns {Promise<Object>} Trip itinerary summary
   */
  getTripItinerarySummary: async (tripId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/trip/${tripId}/summary`, {
        method: 'GET',
        headers: createHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching trip itinerary summary:', error);
      throw error;
    }
  },

  /**
   * Get a specific itinerary item by ID
   * @param {string} id - Itinerary item ID
   * @returns {Promise<Object>} Itinerary item data
   */
  getItineraryById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'GET',
        headers: createHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching itinerary item:', error);
      throw error;
    }
  },

  /**
   * Update an itinerary item
   * @param {string} id - Itinerary item ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated itinerary item
   */
  updateItinerary: async (id, updateData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: createHeaders(),
        body: JSON.stringify(updateData),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error updating itinerary item:', error);
      throw error;
    }
  },

  /**
   * Delete an itinerary item
   * @param {string} id - Itinerary item ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  deleteItinerary: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: createHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error deleting itinerary item:', error);
      throw error;
    }
  },

  /**
   * Reorder itinerary items within a day
   * @param {string} tripId - Trip ID
   * @param {Object} data - {day_number, items: [itemId1, itemId2, ...]}
   * @returns {Promise<Object>} Reorder confirmation
   */
  reorderItinerary: async (tripId, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/trip/${tripId}/reorder`, {
        method: 'PUT',
        headers: createHeaders(),
        body: JSON.stringify(data),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error reordering itinerary items:', error);
      throw error;
    }
  },

  /**
   * Toggle completion status of an itinerary item
   * @param {string} id - Itinerary item ID
   * @returns {Promise<Object>} Updated itinerary item
   */
  toggleCompletion: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/toggle-completion`, {
        method: 'PATCH',
        headers: createHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error toggling completion status:', error);
      throw error;
    }
  },

  /**
   * Helper methods for common use cases
   */
  
  /**
   * Get itinerary for a specific day
   * @param {string} tripId - Trip ID
   * @param {number} dayNumber - Day number
   * @returns {Promise<Object>} Day itinerary data
   */
  getDayItinerary: async (tripId, dayNumber) => {
    return itineraryApi.getTripItinerary(tripId, { day: dayNumber });
  },

  /**
   * Get itinerary by category
   * @param {string} tripId - Trip ID
   * @param {string} category - Category name
   * @returns {Promise<Object>} Category itinerary data
   */
  getCategoryItinerary: async (tripId, category) => {
    return itineraryApi.getTripItinerary(tripId, { category });
  },

  /**
   * Get completed/incomplete items
   * @param {string} tripId - Trip ID
   * @param {boolean} completed - Completion status
   * @returns {Promise<Object>} Filtered itinerary data
   */
  getItineraryByStatus: async (tripId, completed) => {
    return itineraryApi.getTripItinerary(tripId, { completed });
  },

  /**
   * Mark activity as completed
   * @param {string} id - Itinerary item ID
   * @returns {Promise<Object>} Updated itinerary item
   */
  markAsCompleted: async (id) => {
    const item = await itineraryApi.getItineraryById(id);
    if (!item.itinerary.is_completed) {
      return await itineraryApi.toggleCompletion(id);
    }
    return item;
  },

  /**
   * Mark activity as incomplete
   * @param {string} id - Itinerary item ID
   * @returns {Promise<Object>} Updated itinerary item
   */
  markAsIncomplete: async (id) => {
    const item = await itineraryApi.getItineraryById(id);
    if (item.itinerary.is_completed) {
      return await itineraryApi.toggleCompletion(id);
    }
    return item;
  }
};

export default itineraryApi;
