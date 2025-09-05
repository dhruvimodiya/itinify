const API_BASE_URL = 'http://localhost:5000/api/users';

// API utility functions
const api = {
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  resendVerification: async (email) => {
    const response = await fetch(`${API_BASE_URL}/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    return response.json();
  },

  verifyEmail: async (token) => {
    const response = await fetch(`${API_BASE_URL}/verify-email?token=${token}`, {
      method: 'GET',
    });
    return response.json();
  }
};

export default api;
