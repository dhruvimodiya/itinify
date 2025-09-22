import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Navigation,
  List,
  Mountain,
  Compass,
  Map,
  Backpack,
  TreePine,
  Sun
} from 'lucide-react';

const ModernTripCard = ({ trip, onEdit, onDelete, onView, showActions = true }) => {
  const navigate = useNavigate();
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
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
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

  // Get status colors with travel-themed brown palette
  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return {
          bg: 'bg-gradient-to-r from-amber-600 to-yellow-600',
          text: 'text-amber-800',
          bgLight: 'bg-amber-50',
          ring: 'ring-amber-200',
          glow: 'shadow-amber-500/30',
          icon: 'text-amber-600'
        };
      case 'ongoing':
        return {
          bg: 'bg-gradient-to-r from-emerald-600 to-teal-600',
          text: 'text-emerald-800',
          bgLight: 'bg-emerald-50',
          ring: 'ring-emerald-200',
          glow: 'shadow-emerald-500/30',
          icon: 'text-emerald-600'
        };
      case 'completed':
        return {
          bg: 'bg-gradient-to-r from-stone-600 to-neutral-600',
          text: 'text-stone-800',
          bgLight: 'bg-stone-50',
          ring: 'ring-stone-200',
          glow: 'shadow-stone-500/30',
          icon: 'text-stone-600'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-stone-600 to-neutral-600',
          text: 'text-stone-800',
          bgLight: 'bg-stone-50',
          ring: 'ring-stone-200',
          glow: 'shadow-stone-500/30',
          icon: 'text-stone-600'
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
      className={`group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl ${statusColors.glow} transition-all duration-500 cursor-pointer`}
      style={{
        background: 'linear-gradient(135deg, #f5f1eb 0%, #ede3d3 50%, #e8dcc6 100%)',
        border: '1px solid #d4c4a8'
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
        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/80 via-amber-800/40 to-transparent" />
        
        {/* Travel-themed decorative elements */}
        <div className="absolute top-4 left-4">
          <div className="flex space-x-2">
            <div className="p-2 bg-amber-100/20 backdrop-blur-sm rounded-full">
              <Compass className="w-4 h-4 text-amber-100" />
            </div>
            <div className="p-2 bg-amber-100/20 backdrop-blur-sm rounded-full">
              <Mountain className="w-4 h-4 text-amber-100" />
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0">
          {/* Status Badge */}
          <div className="absolute top-6 right-6">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`px-4 py-2 rounded-full text-sm font-semibold text-white ${statusColors.bg} shadow-lg backdrop-blur-sm border border-amber-200/30`}
            >
              <div className="flex items-center space-x-2">
                {status === 'upcoming' && <Sun className="w-4 h-4" />}
                {status === 'ongoing' && <Plane className="w-4 h-4" />}
                {status === 'completed' && <Camera className="w-4 h-4" />}
                <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
              </div>
            </motion.div>
          </div>

          {/* Favorite Button */}
          <div className="absolute bottom-6 right-6">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsFavorited(!isFavorited);
              }}
              className="p-3 bg-amber-100/20 backdrop-blur-sm rounded-full text-white hover:bg-amber-100/30 transition-all duration-300 border border-amber-200/30"
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
            </motion.button>
          </div>

          {/* Action Menu */}
          {showActions && (
            <div className="absolute top-6 left-6">
              <div className="relative">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  className="p-3 bg-amber-100/20 backdrop-blur-sm rounded-full text-white hover:bg-amber-100/30 transition-all duration-300 border border-amber-200/30"
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
                      className="absolute left-0 mt-3 w-56 bg-amber-50/95 backdrop-blur-xl rounded-2xl shadow-xl border border-amber-200/50 py-3 z-50"
                      style={{ backdropFilter: 'blur(20px)' }}
                    >
                      <button
                        onClick={(e) => { 
                          e.stopPropagation();
                          navigate(`/dashboard/itinerary/${trip.trip_id}`);
                          setShowMenu(false); 
                        }}
                        className="flex items-center w-full px-5 py-3 text-sm text-amber-800 hover:bg-amber-100/70 transition-colors"
                      >
                        <List className="w-5 h-5 mr-3 text-amber-600" />
                        Plan Itinerary
                      </button>
                      <button
                        onClick={(e) => { 
                          e.stopPropagation();
                          onView?.(trip); 
                          setShowMenu(false); 
                        }}
                        className="flex items-center w-full px-5 py-3 text-sm text-amber-800 hover:bg-amber-100/70 transition-colors"
                      >
                        <Eye className="w-5 h-5 mr-3 text-amber-600" />
                        View Details
                      </button>
                      <button
                        onClick={(e) => { 
                          e.stopPropagation();
                          onEdit?.(trip); 
                          setShowMenu(false); 
                        }}
                        className="flex items-center w-full px-5 py-3 text-sm text-amber-800 hover:bg-amber-100/70 transition-colors"
                      >
                        <Edit className="w-5 h-5 mr-3 text-amber-600" />
                        Edit Trip
                      </button>
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center w-full px-5 py-3 text-sm text-amber-800 hover:bg-amber-100/70 transition-colors"
                      >
                        <Navigation className="w-5 h-5 mr-3 text-amber-600" />
                        Get Directions
                      </button>
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center w-full px-5 py-3 text-sm text-amber-800 hover:bg-amber-100/70 transition-colors"
                      >
                        <Share2 className="w-5 h-5 mr-3 text-amber-600" />
                        Share Trip
                      </button>
                      <div className="border-t border-amber-200 my-2"></div>
                      <button
                        onClick={(e) => { 
                          e.stopPropagation();
                          onDelete?.(trip); 
                          setShowMenu(false); 
                        }}
                        className="flex items-center w-full px-5 py-3 text-sm text-red-600 hover:bg-red-50/70 transition-colors"
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
            className="absolute bottom-6 left-6 right-20"
          >
            <div className="flex space-x-3">
              <div className="flex-1 bg-amber-100/30 backdrop-blur-lg rounded-xl p-3 border border-amber-200/40">
                <div className="flex items-center space-x-2 text-white">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {formatDate(trip.start_date)}
                  </span>
                </div>
              </div>
              <div className="flex-1 bg-amber-100/30 backdrop-blur-lg rounded-xl p-3 border border-amber-200/40">
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
      <div className="p-6" style={{ background: 'linear-gradient(135deg, #f5f1eb 0%, #ede3d3 100%)' }}>
        {/* Destination and Rating */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <motion.h3 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-bold text-amber-900 mb-2 group-hover:text-amber-700 transition-colors flex items-center gap-2"
            >
              <Map className="w-6 h-6 text-amber-600" />
              {trip.destination}
            </motion.h3>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-amber-500 fill-current" />
              ))}
              <span className="text-sm text-amber-700 ml-2">(4.8)</span>
            </div>
          </div>
        </div>

        {/* Trip Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl p-4 border border-amber-300/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-600 rounded-lg">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-amber-800 uppercase tracking-wide font-medium">Destination</p>
                <p className="text-sm font-semibold text-amber-900">{trip.destination.split(',')[0]}</p>
              </div>
            </div>
          </div>

          {trip.total_budget && (
            <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl p-4 border border-emerald-300/50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-600 rounded-lg">
                  <DollarSign className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-emerald-800 uppercase tracking-wide font-medium">Budget</p>
                  <p className="text-sm font-semibold text-emerald-900">{formatCurrency(trip.total_budget)}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Progress Indicator for Ongoing Trips */}
        {status === 'ongoing' && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-amber-800 mb-3">
              <span className="font-medium flex items-center gap-2">
                <Backpack className="w-4 h-4" />
                Trip Progress
              </span>
              <span className="font-semibold">{Math.round(calculateProgress())}%</span>
            </div>
            <div className="w-full bg-amber-200 rounded-full h-3 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${calculateProgress()}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full shadow-lg"
              />
            </div>
          </div>
        )}

        {/* Countdown for Upcoming Trips */}
        {status === 'upcoming' && (
          <div className="mb-6 text-center">
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl p-4 text-white relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <TreePine className="w-6 h-6 text-amber-200/50" />
              </div>
              <div className="text-2xl font-bold">
                {getDaysUntilStart() === 0 ? 'Starting Today!' : 
                 getDaysUntilStart() === 1 ? '1 Day to Go!' : 
                 `${getDaysUntilStart()} Days to Go!`}
              </div>
              <div className="text-amber-100 text-sm mt-1 flex items-center justify-center gap-2">
                <Plane className="w-4 h-4" />
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
            className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <Eye className="w-5 h-5" />
            <span>View Trip</span>
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/dashboard/itinerary/${trip.trip_id}`);
            }}
            className="px-4 py-4 bg-gradient-to-r from-stone-600 to-stone-700 text-white rounded-xl font-semibold hover:from-stone-700 hover:to-stone-800 transition-all duration-300 flex items-center justify-center hover:shadow-lg"
            title="Plan Itinerary"
          >
            <List className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(trip);
            }}
            className="px-4 py-4 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl transition-all duration-300 flex items-center justify-center hover:shadow-lg border border-amber-300"
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
        className="absolute inset-0 bg-gradient-to-br from-amber-600/5 via-amber-800/5 to-stone-600/5 pointer-events-none rounded-3xl"
      />

      {/* Travel-themed Border Effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-amber-200/30 via-transparent to-amber-200/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
};

export default ModernTripCard;
