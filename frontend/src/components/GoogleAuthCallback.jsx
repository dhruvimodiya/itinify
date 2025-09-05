import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const GoogleAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Processing Google authentication...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = searchParams.get('token');
        const needsPhone = searchParams.get('needs_phone');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          switch (error) {
            case 'oauth_failed':
              setMessage('Google authentication failed. Please try again.');
              break;
            case 'server_error':
              setMessage('Server error occurred. Please try again later.');
              break;
            default:
              setMessage('Authentication failed. Please try again.');
          }
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        if (!token) {
          setStatus('error');
          setMessage('Authentication token not received. Please try again.');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Login with the received token
        const result = await loginWithToken(token);

        if (result.success) {
          setStatus('success');
          
          if (needsPhone === 'true') {
            setMessage('Authentication successful! Please complete your profile.');
            setTimeout(() => navigate('/complete-profile'), 1000);
          } else {
            setMessage('Authentication successful! Redirecting to dashboard...');
            setTimeout(() => navigate('/dashboard'), 1000);
          }
        } else {
          setStatus('error');
          setMessage(result.message || 'Authentication failed. Please try again.');
          setTimeout(() => navigate('/login'), 3000);
        }

      } catch (error) {
        console.error('Google auth callback error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, loginWithToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        {status === 'processing' && (
          <>
            <LoadingSpinner />
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              Processing Authentication
            </h2>
            <p className="mt-2 text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-travel-brown-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Success!</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Failed</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-travel-brown-600 text-white py-2 px-4 rounded-md hover:bg-travel-brown-700 transition-colors"
            >
              Return to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleAuthCallback;
