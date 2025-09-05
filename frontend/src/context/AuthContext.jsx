import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    
    case 'VERIFICATION_REQUIRED':
      return {
        ...state,
        verificationRequired: true,
        email: action.payload.email,
        loading: false,
        error: action.payload.message
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        verificationRequired: false,
        loading: false,
        error: null
      };
    
    case 'REGISTRATION_SUCCESS':
      return {
        ...state,
        registrationEmail: action.payload.email,
        loading: false,
        error: null
      };
    
    default:
      return state;
  }
};

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  verificationRequired: false,
  registrationEmail: null,
  loading: false,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: JSON.parse(storedUser),
          token: storedToken
        }
      });
    }
  }, []);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const login = async (credentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: data.user, token: data.token }
        });
        return { success: true };
      } else if (data.emailVerificationRequired) {
        dispatch({
          type: 'VERIFICATION_REQUIRED',
          payload: { email: credentials.email, message: data.message }
        });
        return { success: false, emailVerificationRequired: true };
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.message || 'Login failed' });
        return { success: false, message: data.message };
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Network error. Please try again.' });
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.status === 201) {
        dispatch({
          type: 'REGISTRATION_SUCCESS',
          payload: { email: userData.email }
        });
        return { success: true };
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.message || 'Registration failed' });
        return { success: false, message: data.message };
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Network error. Please try again.' });
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const resendVerification = async (email) => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      dispatch({ type: 'SET_LOADING', payload: false });

      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  // Login with token (for Google OAuth)
  const loginWithToken = async (token) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Verify token and get user data
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: data.user,
            token: token
          }
        });

        return { success: true };
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.message });
        return { success: false, message: data.message };
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Authentication failed' });
      return { success: false, message: 'Authentication failed' };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Update user profile (for completing Google OAuth profile)
  const updateUserProfile = (updatedUser) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: {
        user: updatedUser,
        token: state.token
      }
    });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      loginWithToken,
      register,
      logout,
      resendVerification,
      updateUserProfile,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
