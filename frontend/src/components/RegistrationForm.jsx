import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleAuthButton from './GoogleAuthButton';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    password: '',
    confirmPassword: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const { register, loading, error, registrationEmail, clearError } = useAuth();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Sample travel destinations for the scrolling effect
  const destinations = [
    {
      id: 1,
      name: "Adventure Awaits",
      location: "New Zealand",
      distance: "0 km",
      description: "to your next adventure",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: 2,
      name: "Mountain Peak",
      location: "Swiss Alps",
      distance: "Join us",
      description: "for incredible journeys",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: 3,
      name: "Tropical Paradise",
      location: "Maldives",
      distance: "Start",
      description: "your travel story today",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: 4,
      name: "Ancient Wonders",
      location: "Machu Picchu",
      distance: "Explore",
      description: "hidden treasures",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
    },
    {
      id: 5,
      name: "Urban Adventures",
      location: "Tokyo",
      distance: "Discover",
      description: "vibrant cultures",
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

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.number.trim()) {
      errors.number = 'Phone number is required';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    const { confirmPassword, ...registrationData } = formData;
    const result = await register(registrationData);
    
    if (result.success) {
      navigate('/registration-success');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    clearError();
    // Clear validation error for this field
    if (validationErrors[e.target.name]) {
      setValidationErrors({
        ...validationErrors,
        [e.target.name]: ''
      });
    }
  };

  // If registration was successful, show success message
  if (registrationEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-travel-brown-50 to-travel-brown-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mb-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-travel-brown-100">
                <svg className="h-6 w-6 text-travel-brown-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration Successful!</h2>
            <p className="text-gray-600 mb-4">
              We've sent a verification email to <strong>{registrationEmail}</strong>
            </p>
            <p className="text-gray-600 mb-6">
              Please check your email and click the verification link to activate your account.
            </p>
            
            <div className="bg-travel-brown-50 border border-travel-brown-200 rounded-md p-4 mb-6">
              <h4 className="text-sm font-medium text-travel-brown-800 mb-2">What's Next?</h4>
              <ol className="text-sm text-travel-brown-700 text-left space-y-1">
                <li>1. Check your email inbox (and spam folder)</li>
                <li>2. Click the verification link</li>
                <li>3. You'll be redirected to login</li>
                <li>4. Login with your credentials</li>
              </ol>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/login')}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-travel-brown-600 hover:bg-travel-brown-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-travel-brown-500"
              >
                Go to Login
              </button>
              <button
                onClick={() => navigate('/resend-verification')}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-travel-brown-500"
              >
                Resend Verification Email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" 
         style={{
           backgroundImage: `url(${destinations[currentImageIndex].image})`,
           backgroundSize: 'cover',
           backgroundPosition: 'center',
         }}>
      
      {/* Main Card Container */}
      <div className="bg-white rounded-3xl p-2 shadow-2xl overflow-hidden max-w-5xl w-full h-[600px] flex">
        
       

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
                <p className="text-xs text-gray-500">Join our community</p>
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
                className={`w-2 h-2 rounded-full transition-colors duration-300 cursor-pointer ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
                onClick={() => handleImageNavigation(index)}
              />
            ))}
          </div>
        </div>

         {/* Left Side - Form */}
        <div className="w-2/5 p-6 flex flex-col justify-center overflow-hidden">
          {/* Brand */}
          <div className="mb-4 flex gap-1">
            <h1 className="text-3xl font-bold text-travel-brown-600 mb-2">Itinify</h1>
            <h2 className="text-sm mt-4 text-black leading-tight">
              Start your
              adventure today
            </h2>
          </div>

          {/* Google Authentication */}
          <div className="mb-4">
            <GoogleAuthButton type="register" />
          </div>

          {/* Divider */}
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-3" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 p-3">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Registration Error</h3>
                    <div className="mt-1 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className={`w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-travel-brown-500 focus:bg-white transition-all ${
                  validationErrors.name ? 'ring-2 ring-red-500' : ''
                }`}
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
              )}
            </div>

            <div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className={`w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-travel-brown-500 focus:bg-white transition-all ${
                  validationErrors.email ? 'ring-2 ring-red-500' : ''
                }`}
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <input
                id="number"
                name="number"
                type="tel"
                required
                value={formData.number}
                onChange={handleChange}
                placeholder="Phone Number"
                className={`w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-travel-brown-500 focus:bg-white transition-all ${
                  validationErrors.number ? 'ring-2 ring-red-500' : ''
                }`}
              />
              {validationErrors.number && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.number}</p>
              )}
            </div>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`w-full px-4 py-3 pr-12 bg-gray-100 border-0 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-travel-brown-500 focus:bg-white transition-all ${
                  validationErrors.password ? 'ring-2 ring-red-500' : ''
                }`}
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
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
              )}
            </div>

            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className={`w-full px-4 py-3 pr-12 bg-gray-100 border-0 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-travel-brown-500 focus:bg-white transition-all ${
                  validationErrors.confirmPassword ? 'ring-2 ring-red-500' : ''
                }`}
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                {showConfirmPassword ? (
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
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
              )}
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
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>

            <div className="text-center pt-2">
              <span className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-travel-brown-600 hover:text-travel-brown-700 underline"
                >
                  Sign in
                </Link>
              </span>
            </div>
          </form>
        </div>
        
      </div>
    </div>
  );
};

export default RegistrationForm;
