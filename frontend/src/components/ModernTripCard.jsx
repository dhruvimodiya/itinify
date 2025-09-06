import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  Clock, 
  Edit, 
  Trash2, 
  MoreVertical,
  Plane,
  Camera,
  Heart,
  Share2,
  Eye,
  Star,
  Navigation
} from 'lucide-react';

const ModernTripCard = ({ trip, onEdit, onDelete, onView, showActions = true }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // Calculate trip status
  const getTripStatus = () => {
    const today = new Date();
    const startDate = new Date(trip.start_date);
    const endDate = new Date(trip.end_date);
    
    if (startDate > today) return 'upcoming';
    if (startDate <= today && endDate >= today) return 'ongoing';
    return 'completed';
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate duration
  const getDuration = () => {
    if (trip.duration_days) {
      return trip.duration_days === 1 ? '1 day' : `${trip.duration_days} days`;
    }
    
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays === 1 ? '1 day' : `${diffDays} days`;
  };

  const status = trip.status || getTripStatus();

  // Get status colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return {
          bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
          text: 'text-blue-700',
          bgLight: 'bg-blue-50',
          ring: 'ring-blue-200',
          glow: 'shadow-blue-500/25'
        };
      case 'ongoing':
        return {
          bg: 'bg-gradient-to-r from-green-500 to-green-600',
          text: 'text-green-700',
          bgLight: 'bg-green-50',
          ring: 'ring-green-200',
          glow: 'shadow-green-500/25'
        };
      case 'completed':
        return {
          bg: 'bg-gradient-to-r from-gray-500 to-gray-600',
          text: 'text-gray-700',
          bgLight: 'bg-gray-50',
          ring: 'ring-gray-200',
          glow: 'shadow-gray-500/25'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-500 to-gray-600',
          text: 'text-gray-700',
          bgLight: 'bg-gray-50',
          ring: 'ring-gray-200',
          glow: 'shadow-gray-500/25'
        };
    }
  };

  const statusColors = getStatusColor(status);

  // Get destination image (placeholder for now)
  const getDestinationImage = (destination) => {
    const images = {
      'Paris': 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop',
      'Tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
      'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop',
      'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop',
      'Bali': 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop',
      'Sydney': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
    };
    
    const cityName = destination.split(',')[0];
    return images[cityName] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop';
  };

  const cardVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    hover: { 
      y: -8,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const menuVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: -10,
      transition: { duration: 0.15 }
    }
  };

  const calculateProgress = () => {
    if (status !== 'ongoing') return 0;
    const today = new Date();
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    const total = end - start;
    const elapsed = today - start;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  const getDaysUntilStart = () => {
    if (status !== 'upcoming') return 0;
    const today = new Date();
    const startDate = new Date(trip.start_date);
    const diffTime = startDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`group relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-lg border border-white/20 shadow-xl hover:shadow-2xl ${statusColors.glow} transition-all duration-500`}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)'
      }}
    >
      {/* Background Image */}
      <div className="relative h-56 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ 
            backgroundImage: `url(${getDestinationImage(trip.destination)})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Floating Elements */}
        <div className="absolute inset-0">
          {/* Status Badge */}
          <div className="absolute top-6 left-6">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`px-4 py-2 rounded-full text-sm font-semibold text-white ${statusColors.bg} shadow-lg backdrop-blur-sm border border-white/20`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </motion.div>
          </div>

          {/* Favorite Button */}
          <div className="absolute top-6 right-16">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsFavorited(!isFavorited);
              }}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300"
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
            </motion.button>
          </div>

          {/* Action Menu */}
          {showActions && (
            <div className="absolute top-6 right-6">
              <div className="relative">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300"
                >
                  <MoreVertical className="w-5 h-5" />
                </motion.button>
                
                <AnimatePresence>
                  {showMenu && (
                    <motion.div
                      variants={menuVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 py-3 z-50"
                      style={{ backdropFilter: 'blur(20px)' }}
                    >
                      <button
                        onClick={(e) => { 
                          e.stopPropagation();
                          onView?.(trip); 
                          setShowMenu(false); 
                        }}
                        className="flex items-center w-full px-5 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                      >
                        <Eye className="w-5 h-5 mr-3 text-blue-500" />
                        View Details
                      </button>
                      <button
                        onClick={(e) => { 
                          e.stopPropagation();
                          onEdit?.(trip); 
                          setShowMenu(false); 
                        }}
                        className="flex items-center w-full px-5 py-3 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                      >
                        <Edit className="w-5 h-5 mr-3 text-purple-500" />
                        Edit Trip
                      </button>
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center w-full px-5 py-3 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                      >
                        <Navigation className="w-5 h-5 mr-3 text-green-500" />
                        Get Directions
                      </button>
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center w-full px-5 py-3 text-sm text-gray-700 hover:bg-orange-50 transition-colors"
                      >
                        <Share2 className="w-5 h-5 mr-3 text-orange-500" />
                        Share Trip
                      </button>
                      <div className="border-t border-gray-100 my-2"></div>
                      <button
                        onClick={(e) => { 
                          e.stopPropagation();
                          onDelete?.(trip); 
                          setShowMenu(false); 
                        }}
                        className="flex items-center w-full px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-5 h-5 mr-3" />
                        Delete Trip
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Floating Info Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-6 left-6 right-6"
          >
            <div className="flex space-x-3">
              <div className="flex-1 bg-white/20 backdrop-blur-lg rounded-xl p-3 border border-white/30">
                <div className="flex items-center space-x-2 text-white">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {formatDate(trip.start_date)}
                  </span>
                </div>
              </div>
              <div className="flex-1 bg-white/20 backdrop-blur-lg rounded-xl p-3 border border-white/30">
                <div className="flex items-center space-x-2 text-white">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">{getDuration()}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Destination and Rating */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <motion.h3 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors"
            >
              {trip.destination}
            </motion.h3>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
              <span className="text-sm text-gray-500 ml-2">(4.8)</span>
            </div>
          </div>
        </div>

        {/* Trip Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide">Destination</p>
                <p className="text-sm font-semibold text-gray-900">{trip.destination.split(',')[0]}</p>
              </div>
            </div>
          </div>

          {trip.total_budget && (
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200/50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <DollarSign className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Budget</p>
                  <p className="text-sm font-semibold text-gray-900">{formatCurrency(trip.total_budget)}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Progress Indicator for Ongoing Trips */}
        {status === 'ongoing' && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-3">
              <span className="font-medium">Trip Progress</span>
              <span className="font-semibold">{Math.round(calculateProgress())}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${calculateProgress()}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full shadow-lg"
              />
            </div>
          </div>
        )}

        {/* Countdown for Upcoming Trips */}
        {status === 'upcoming' && (
          <div className="mb-6 text-center">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
              <div className="text-2xl font-bold">
                {getDaysUntilStart() === 0 ? 'Starting Today!' : 
                 getDaysUntilStart() === 1 ? '1 Day to Go!' : 
                 `${getDaysUntilStart()} Days to Go!`}
              </div>
              <div className="text-blue-100 text-sm mt-1">
                Until your adventure begins
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onView?.(trip);
            }}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <Eye className="w-5 h-5" />
            <span>View Trip</span>
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(trip);
            }}
            className="px-4 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-300 flex items-center justify-center hover:shadow-lg"
          >
            <Edit className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Gradient Overlay on Hover */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-teal-600/5 pointer-events-none rounded-3xl"
      />

      {/* Glassmorphism Border Effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/20 via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
};

export default ModernTripCard;
