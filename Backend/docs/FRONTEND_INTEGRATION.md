# Frontend Integration Guide - Email Verification System

## Overview
This guide provides complete instructions for integrating the email verification system with your frontend application (React, Vue, Angular, or any framework).

## Table of Contents
1. [API Integration](#api-integration)
2. [User Registration Flow](#user-registration-flow)
3. [Email Verification Flow](#email-verification-flow)
4. [Login Flow](#login-flow)
5. [UI Components](#ui-components)
6. [Error Handling](#error-handling)
7. [State Management](#state-management)
8. [Example Implementation](#example-implementation)

## API Integration

### Base Configuration
```javascript
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
  }
};
```

## User Registration Flow

### 1. Registration Form Component

```jsx
// React Example - RegistrationForm.jsx
import React, { useState } from 'react';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 201) {
        setSuccess(true);
        // Show success message
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="success-container">
        <h2>✅ Registration Successful!</h2>
        <p>
          We've sent a verification email to <strong>{formData.email}</strong>
        </p>
        <p>
          Please check your email and click the verification link to activate your account.
        </p>
        <div className="action-buttons">
          <button onClick={() => window.location.href = '/login'}>
            Go to Login
          </button>
          <button onClick={() => setSuccess(false)}>
            Register Another User
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="registration-form">
      <h2>Create Account</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>
      
      <div className="form-group">
        <input
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
      </div>
      
      <div className="form-group">
        <input
          type="tel"
          placeholder="Phone Number"
          value={formData.number}
          onChange={(e) => setFormData({...formData, number: e.target.value})}
          required
        />
      </div>
      
      <div className="form-group">
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />
      </div>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  );
};

export default RegistrationForm;
```

### 2. Registration Success Page

```jsx
// RegistrationSuccess.jsx
import React, { useState } from 'react';

const RegistrationSuccess = ({ email }) => {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResendVerification = async () => {
    setResending(true);
    try {
      const response = await fetch('http://localhost:5000/api/users/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setResent(true);
        setTimeout(() => setResent(false), 5000);
      }
    } catch (error) {
      console.error('Failed to resend verification email');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="verification-pending">
      <div className="icon">📧</div>
      <h2>Check Your Email</h2>
      <p>
        We've sent a verification link to <strong>{email}</strong>
      </p>
      <p>
        Click the link in the email to verify your account and complete registration.
      </p>
      
      <div className="info-box">
        <h4>What's Next?</h4>
        <ol>
          <li>Check your email inbox (and spam folder)</li>
          <li>Click the verification link</li>
          <li>You'll be redirected to login</li>
          <li>Login with your credentials</li>
        </ol>
      </div>

      {resent && (
        <div className="success-message">
          ✅ Verification email resent successfully!
        </div>
      )}

      <div className="action-buttons">
        <button onClick={handleResendVerification} disabled={resending}>
          {resending ? 'Resending...' : 'Resend Verification Email'}
        </button>
        <button onClick={() => window.location.href = '/login'}>
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
```

## Email Verification Flow

### 1. Verification Handling
The backend serves HTML pages for verification, but you can also handle this in your frontend:

```jsx
// VerificationHandler.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const VerificationHandler = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    // Let the backend handle verification with its HTML pages
    // Or implement client-side verification:
    verifyEmail(token);
  }, [searchParams]);

  const verifyEmail = async (token) => {
    try {
      // Option 1: Redirect to backend verification endpoint
      window.location.href = `http://localhost:5000/api/users/verify-email?token=${token}`;
      
      // Option 2: Handle verification in frontend (if you modify backend to return JSON)
      /*
      const response = await fetch(`http://localhost:5000/api/users/verify-email?token=${token}`);
      const data = await response.json();
      
      if (response.ok) {
        setStatus('success');
        setMessage('Email verified successfully!');
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.message || 'Verification failed');
      }
      */
    } catch (error) {
      setStatus('error');
      setMessage('Verification failed. Please try again.');
    }
  };

  return (
    <div className="verification-status">
      {status === 'verifying' && (
        <div>
          <div className="spinner"></div>
          <h2>Verifying your email...</h2>
        </div>
      )}
      
      {status === 'success' && (
        <div>
          <div className="success-icon">✅</div>
          <h2>Email Verified!</h2>
          <p>{message}</p>
          <p>Redirecting to login...</p>
        </div>
      )}
      
      {status === 'error' && (
        <div>
          <div className="error-icon">❌</div>
          <h2>Verification Failed</h2>
          <p>{message}</p>
          <button onClick={() => window.location.href = '/resend-verification'}>
            Request New Verification Email
          </button>
        </div>
      )}
    </div>
  );
};

export default VerificationHandler;
```

## Login Flow

### 1. Login Form with Verification Check

```jsx
// LoginForm.jsx
import React, { useState } from 'react';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setNeedsVerification(false);

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/dashboard';
      } else if (data.emailVerificationRequired) {
        // Email verification required
        setNeedsVerification(true);
        setError(data.message);
      } else {
        // Other login errors
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: credentials.email }),
      });

      if (response.ok) {
        alert('Verification email sent! Please check your email.');
      }
    } catch (error) {
      alert('Failed to send verification email. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        
        {error && (
          <div className={`error-message ${needsVerification ? 'verification-error' : ''}`}>
            {error}
            {needsVerification && (
              <div className="verification-actions">
                <button type="button" onClick={handleResendVerification}>
                  Resend Verification Email
                </button>
              </div>
            )}
          </div>
        )}
        
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            value={credentials.email}
            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
            required
          />
        </div>
        
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        
        <div className="form-links">
          <a href="/register">Don't have an account? Register</a>
          <a href="/resend-verification">Need verification email?</a>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
```

## UI Components

### 1. Resend Verification Component

```jsx
// ResendVerification.jsx
import React, { useState } from 'react';

const ResendVerification = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/users/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.message || 'Failed to send verification email');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="resend-success">
        <h2>✅ Verification Email Sent!</h2>
        <p>We've sent a new verification email to <strong>{email}</strong></p>
        <p>Please check your email and click the verification link.</p>
        <button onClick={() => window.location.href = '/login'}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="resend-verification">
      <h2>Resend Verification Email</h2>
      <p>Enter your email address to receive a new verification link.</p>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Verification Email'}
        </button>
      </form>
      
      <div className="form-links">
        <a href="/login">Back to Login</a>
        <a href="/register">Create New Account</a>
      </div>
    </div>
  );
};

export default ResendVerification;
```

## Error Handling

### Error Types and Handling

```javascript
// errorHandler.js
export const handleAuthError = (error, navigate) => {
  switch (error.type) {
    case 'EMAIL_NOT_VERIFIED':
      navigate('/verification-required', { 
        state: { email: error.email } 
      });
      break;
    
    case 'INVALID_CREDENTIALS':
      return 'Invalid email or password';
    
    case 'USER_NOT_FOUND':
      return 'No account found with this email';
    
    case 'VERIFICATION_TOKEN_EXPIRED':
      navigate('/resend-verification');
      break;
    
    default:
      return 'An unexpected error occurred';
  }
};
```

## State Management

### Context API Example

```jsx
// AuthContext.jsx
import React, { createContext, useContext, useReducer } from 'react';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false
      };
    
    case 'VERIFICATION_REQUIRED':
      return {
        ...state,
        verificationRequired: true,
        email: action.payload.email,
        loading: false
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        verificationRequired: false
      };
    
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    verificationRequired: false,
    loading: false
  });

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
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
```

## Router Configuration

### React Router Setup

```jsx
// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import VerificationHandler from './components/VerificationHandler';
import ResendVerification from './components/ResendVerification';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/verify-email" element={<VerificationHandler />} />
          <Route path="/resend-verification" element={<ResendVerification />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<LoginForm />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
```

## CSS Styling

### Example Styles

```css
/* styles.css */
.registration-form, .login-form {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.verification-error {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.success-message {
  background: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.verification-pending {
  text-align: center;
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
}

.verification-pending .icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.info-box {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 1rem;
  margin: 1rem 0;
  text-align: left;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.action-buttons button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.action-buttons button:first-child {
  background: #007bff;
  color: white;
}

.action-buttons button:last-child {
  background: #6c757d;
  color: white;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

## Testing

### Frontend Testing Checklist

1. **Registration Flow**:
   - [ ] Form validation works
   - [ ] Success message displays after registration
   - [ ] Error handling for existing users
   - [ ] Resend verification email works

2. **Email Verification**:
   - [ ] Verification links work correctly
   - [ ] Success page displays after verification
   - [ ] Error page displays for invalid tokens
   - [ ] Automatic redirect to login works

3. **Login Flow**:
   - [ ] Login blocked for unverified users
   - [ ] Proper error message for unverified users
   - [ ] Resend verification from login page works
   - [ ] Successful login after verification

4. **Edge Cases**:
   - [ ] Expired verification tokens
   - [ ] Multiple verification attempts
   - [ ] Network errors handling
   - [ ] Invalid email formats

## Production Considerations

1. **Environment Variables**:
   ```env
   REACT_APP_API_URL=https://your-api-domain.com/api/users
   REACT_APP_FRONTEND_URL=https://your-frontend-domain.com
   ```

2. **Security**:
   - Store JWT tokens securely (httpOnly cookies recommended)
   - Implement proper CORS configuration
   - Add rate limiting for verification requests

3. **SEO**:
   - Add proper meta tags for verification pages
   - Implement server-side rendering if needed

4. **Analytics**:
   - Track verification completion rates
   - Monitor email delivery success
   - Track user registration funnel

This guide provides a complete implementation for integrating the email verification system with your frontend application. Adapt the code examples to your specific framework and styling requirements.
