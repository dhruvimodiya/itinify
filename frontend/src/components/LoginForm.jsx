import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
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
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <Alert variant={verificationRequired ? "default" : "destructive"}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div>
                    <p className="font-medium mb-2">
                      {verificationRequired ? 'Email Verification Required' : 'Login Error'}
                    </p>
                    <p>{error}</p>
                    {verificationRequired && (
                      <div className="mt-4">
                        <Button
                          type="button"
                          onClick={handleResendVerification}
                          disabled={resendLoading}
                          variant="outline"
                          size="sm"
                          className="border-travel-brown-300 hover:bg-travel-brown-50"
                        >
                          {resendLoading ? 'Sending...' : 'Resend Verification Email'}
                        </Button>
                        {resendMessage && (
                          <p className="mt-2 text-sm text-travel-brown-600">{resendMessage}</p>
                        )}
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-travel-brown-800 font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={credentials.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="border-travel-brown-200 focus:border-travel-brown-500 focus:ring-travel-brown-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-travel-brown-800 font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="border-travel-brown-200 focus:border-travel-brown-500 focus:ring-travel-brown-500 pr-12"
                />
                <Button
                  type="button"
                  onClick={togglePasswordVisibility}
                  variant="ghost"
                  size="sm"
                  className="absolute inset-y-0 right-0 px-3 hover:bg-transparent"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-travel-brown-600 hover:bg-travel-brown-700 text-white font-medium py-3 transition-colors"
              size="lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>

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
