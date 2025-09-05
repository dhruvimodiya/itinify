import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleAuthButton from './GoogleAuthButton';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const { login, loading, error, verificationRequired, resendVerification, clearError } = useAuth();
  const navigate = useNavigate();
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Sample travel destinations for the scrolling effect
  const destinations = [
    {
      id: 1,
      name: "Gringo Trail",
      location: "Villa Mexico",
      distance: "1.2 km",
      description: "left to your accommodation",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: 2,
      name: "Mountain View",
      location: "Costa Rica",
      distance: "2.5 km",
      description: "scenic hiking trail",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: 3,
      name: "Beach Paradise",
      location: "Tulum",
      distance: "5.8 km",
      description: "pristine beach access",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: 4,
      name: "Forest Trail",
      location: "Amazon",
      distance: "3.2 km",
      description: "rainforest adventure",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
    },
    {
      id: 5,
      name: "Desert Oasis",
      location: "Sahara",
      distance: "4.7 km",
      description: "desert expedition",
      image: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    }
  ];

  // Auto-change image every 4 seconds (only when autoplay is enabled)
  React.useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % destinations.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [destinations.length, isAutoPlay]);

  // Handle manual image navigation
  const handleImageNavigation = (index) => {
    setCurrentImageIndex(index);
    setIsAutoPlay(false);
    // Resume autoplay after 10 seconds of manual interaction
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    clearError();
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    const result = await login(credentials);
    
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    setResendMessage('');
    
    const result = await resendVerification(credentials.email);
    
    if (result.success) {
      setResendMessage('Verification email sent! Please check your email.');
    } else {
      setResendMessage(result.message || 'Failed to send verification email.');
    }
    
    setResendLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" 
         style={{
           backgroundImage: `url(${destinations[currentImageIndex].image})`,
           backgroundSize: 'cover',
           backgroundPosition: 'center',
         }}>
      
      {/* Main Card Container */}
      <div className="bg-white rounded-3xl p-2 shadow-2xl overflow-hidden max-w-5xl w-full h-[560px] flex">
        
        {/* Left Side - Form */}
        <div className="w-2/5 p-8 flex flex-col justify-center">
          {/* Brand */}
          <div className="mb-8">
            <h1 className="text-2xl font-normal text-travel-brown-600 mb-2">Itinify</h1>
            <h2 className="text-3xl font-bold text-black leading-tight">
              Welcome back<br />
              to your journey
            </h2>
          </div>

          {/* Google Authentication */}
          <div className="mb-6">
            <GoogleAuthButton type="login" />
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className={`rounded-md p-4 ${verificationRequired ? 'bg-yellow-50 border border-yellow-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex">
                  <div className="ml-3">
                    <h3 className={`text-sm font-medium ${verificationRequired ? 'text-yellow-800' : 'text-red-800'}`}>
                      {verificationRequired ? 'Email Verification Required' : 'Login Error'}
                    </h3>
                    <div className={`mt-2 text-sm ${verificationRequired ? 'text-yellow-700' : 'text-red-700'}`}>
                      <p>{error}</p>
                      {verificationRequired && (
                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={handleResendVerification}
                            disabled={resendLoading}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
                          >
                            {resendLoading ? 'Sending...' : 'Resend Verification Email'}
                          </button>
                          {resendMessage && (
                            <p className="mt-2 text-sm text-travel-brown-600">{resendMessage}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={credentials.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-travel-brown-500 focus:bg-white transition-all"
              />
            </div>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={credentials.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-3 pr-12 bg-gray-100 border-0 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-travel-brown-500 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                {showPassword ? (
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-travel-brown-600 hover:bg-travel-brown-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-travel-brown-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>

            <div className="text-center pt-2">
              <span className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-travel-brown-600 hover:text-travel-brown-700 underline"
                >
                  Sign up
                </Link>
              </span>
            </div>
          </form>
        </div>

        {/* Right Side - Image with Overlays */}
        <div className="w-3/5 relative overflow-hidden">
          {/* Current Image */}
          <div 
            className="absolute inset-0 transition-all rounded-3xl duration-1000 ease-in-out"
            style={{
              backgroundImage: `url(${destinations[currentImageIndex].image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          {/* Location Marker - Top Left */}
          <div className="absolute top-8 left-8 z-10">
            <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Gordo village</p>
                <p className="text-sm font-medium text-gray-900">{destinations[currentImageIndex].location}</p>
              </div>
            </div>
          </div>

          {/* Distance Marker - Top Right */}
          <div className="absolute top-20 right-8 z-10">
            <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg text-right">
              <p className="text-xl font-bold text-gray-900">{destinations[currentImageIndex].distance}</p>
              <p className="text-xs text-gray-600">{destinations[currentImageIndex].description}</p>
            </div>
          </div>

          {/* Trail Name - Bottom Center */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-6 py-2 shadow-lg">
              <p className="text-sm font-medium text-gray-900">{destinations[currentImageIndex].name}</p>
            </div>
          </div>

          {/* Image Indicators */}
          <div className="absolute bottom-4 right-4 z-10 flex space-x-2">
            {destinations.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
