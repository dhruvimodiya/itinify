import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const VerificationHandler = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link - no token provided');
      return;
    }

    verifyEmail(token);
  }, [searchParams]);

  const verifyEmail = async (token) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/verify-email?token=${token}`, {
        method: 'GET',
      });

      if (response.ok) {
        setStatus('success');
        setMessage('Email verified successfully! You can now login to your account.');
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        const data = await response.json();
        setStatus('error');
        setMessage(data.message || 'Verification failed');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Verification failed. Please try again or request a new verification email.');
    }
  };

  const handleResendVerification = () => {
    navigate('/resend-verification');
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-travel-brown-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-md p-8 text-center border border-travel-brown-200">
          {status === 'verifying' && (
            <div>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-travel-brown-100 mb-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-travel-brown-600"></div>
              </div>
              <h2 className="text-2xl font-bold text-travel-brown-800 mb-4">Verifying your email...</h2>
              <p className="text-travel-brown-600">Please wait while we verify your email address.</p>
            </div>
          )}
          
          {status === 'success' && (
            <div>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-travel-brown-100 mb-4">
                <svg className="h-6 w-6 text-travel-brown-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-travel-brown-800 mb-4">Email Verified!</h2>
              <p className="text-travel-brown-600 mb-6">{message}</p>
              <button
                onClick={handleGoToLogin}
                className="w-full py-2 px-4 rounded-md text-white bg-travel-brown-600 hover:bg-travel-brown-700"
              >
                Go to Login
              </button>
            </div>
          )}
          
          {status === 'error' && (
            <div>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-travel-brown-100 mb-4">
                <svg className="h-6 w-6 text-travel-brown-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-travel-brown-800 mb-4">Verification Failed</h2>
              <p className="text-travel-brown-600 mb-6">{message}</p>
              
              <div className="space-y-3">
                <button
                  onClick={handleResendVerification}
                  className="w-full py-2 px-4 rounded-md text-white bg-travel-brown-600 hover:bg-travel-brown-700"
                >
                  Request New Verification Email
                </button>
                <button
                  onClick={handleGoToLogin}
                  className="w-full py-2 px-4 rounded-md text-travel-brown-600 bg-travel-brown-100 hover:bg-travel-brown-200"
                >
                  Go to Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationHandler;
