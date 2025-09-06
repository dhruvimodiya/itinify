import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock, 
  Edit, 
  Share2,
  Heart,
  Navigation,
  Camera,
  Star,
  TrendingUp,
  Users,
  Plane,
  Hotel,
  Utensils,
  Car,
  Ticket,
  ChevronRight,
  Plus,
  CheckCircle
} from 'lucide-react';

const ModernTripDetails = ({ trip, onEdit, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorited, setIsFavorited] = useState(false);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // Get trip status
  const getTripStatus = () => {
    const today = new Date();
    const startDate = new Date(trip.start_date);
    const endDate = new Date(trip.end_date);
    
    if (startDate > today) return 'upcoming';
    if (startDate <= today && endDate >= today) return 'ongoing';
    return 'completed';
  };

  const status = getTripStatus();

  // Get status colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'from-blue-500 to-blue-600';
      case 'ongoing':
        return 'from-green-500 to-green-600';
      case 'completed':
        return 'from-gray-500 to-gray-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const statusColor = getStatusColor(status);

  // Get destination image
  const getDestinationImage = (destination) => {
    const images = {
      'Paris': 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=1200&h=600&fit=crop',
      'Tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&h=600&fit=crop',
      'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&h=600&fit=crop',
      'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&h=600&fit=crop',
      'Bali': 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=1200&h=600&fit=crop',
      'Sydney': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop'
    };
    
    const cityName = destination.split(',')[0];
    return images[cityName] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=600&fit=crop';
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: MapPin },
    { id: 'itinerary', label: 'Itinerary', icon: Calendar },
    { id: 'budget', label: 'Budget', icon: DollarSign },
    { id: 'gallery', label: 'Gallery', icon: Camera }
  ];

  const mockItinerary = [
    {
      day: 1,
      date: trip.start_date,
      activities: [
        { time: '09:00', title: 'Arrival & Check-in', location: 'Hotel', icon: Hotel },
        { time: '14:00', title: 'City Walking Tour', location: 'Downtown', icon: MapPin },
        { time: '19:00', title: 'Welcome Dinner', location: 'Local Restaurant', icon: Utensils }
      ]
    },
    {
      day: 2,
      date: new Date(new Date(trip.start_date).getTime() + 24 * 60 * 60 * 1000).toISOString(),
      activities: [
        { time: '10:00', title: 'Museum Visit', location: 'Art Museum', icon: Ticket },
        { time: '15:00', title: 'Shopping District', location: 'Main Street', icon: MapPin },
        { time: '20:00', title: 'Night Market', location: 'Food Street', icon: Utensils }
      ]
    }
  ];

  const budgetBreakdown = [
    { category: 'Accommodation', amount: (trip.total_budget || 0) * 0.4, icon: Hotel, color: 'text-blue-600' },
    { category: 'Food & Dining', amount: (trip.total_budget || 0) * 0.3, icon: Utensils, color: 'text-green-600' },
    { category: 'Transportation', amount: (trip.total_budget || 0) * 0.2, icon: Car, color: 'text-purple-600' },
    { category: 'Activities', amount: (trip.total_budget || 0) * 0.1, icon: Ticket, color: 'text-orange-600' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
    >
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${getDestinationImage(trip.destination)})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        {/* Floating Controls */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
          <button
            onClick={onBack}
            className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <ChevronRight className="w-6 h-6 rotate-180" />
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
            >
              <Heart className={`w-6 h-6 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
              <Share2 className="w-6 h-6" />
            </button>
            <button
              onClick={() => onEdit?.(trip)}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
            >
              <Edit className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Trip Info */}
        <div className="absolute bottom-6 left-6 right-6">
          <motion.div variants={itemVariants}>
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-white bg-gradient-to-r ${statusColor} mb-4`}>
              <span className="text-sm font-semibold">
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {trip.destination}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>{formatDate(trip.start_date)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>{getDuration()} days</span>
              </div>
              {trip.total_budget && (
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>{formatCurrency(trip.total_budget)}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2">(4.8)</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center space-x-2 py-4 px-1 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Trip Overview</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed">
                    Discover the magic of {trip.destination} in this carefully planned {getDuration()}-day adventure. 
                    From iconic landmarks to hidden gems, this trip offers the perfect blend of culture, 
                    cuisine, and unforgettable experiences.
                  </p>
                  <p className="text-gray-600 leading-relaxed mt-4">
                    Whether you're seeking adventure, relaxation, or cultural immersion, this destination 
                    has something special waiting for you. Our curated itinerary ensures you make the most 
                    of every moment while staying within your budget.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-6 mt-8">
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <Plane className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Best Time to Visit</p>
                    <p className="font-semibold text-gray-900">Year Round</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Recommended For</p>
                    <p className="font-semibold text-gray-900">Solo & Groups</p>
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="flex flex-col items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                    <Navigation className="w-8 h-8 text-blue-600 mb-2" />
                    <span className="text-sm font-medium text-gray-900">Get Directions</span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                    <Hotel className="w-8 h-8 text-green-600 mb-2" />
                    <span className="text-sm font-medium text-gray-900">Book Hotel</span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                    <Car className="w-8 h-8 text-purple-600 mb-2" />
                    <span className="text-sm font-medium text-gray-900">Rent Car</span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors">
                    <Ticket className="w-8 h-8 text-orange-600 mb-2" />
                    <span className="text-sm font-medium text-gray-900">Activities</span>
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Trip Stats */}
              <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Trip Details</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date</span>
                    <span className="font-medium">{new Date(trip.start_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">End Date</span>
                    <span className="font-medium">{new Date(trip.end_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{getDuration()} days</span>
                  </div>
                  {trip.total_budget && (
                    <div className="flex justify-between pt-4 border-t border-gray-200">
                      <span className="text-gray-600">Budget</span>
                      <span className="font-bold text-blue-600">{formatCurrency(trip.total_budget)}</span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Weather */}
              <motion.div variants={itemVariants} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Weather Forecast</h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">22°C</div>
                  <p className="text-blue-700">Partly Cloudy</p>
                  <p className="text-sm text-blue-600 mt-2">Perfect for sightseeing!</p>
                </div>
              </motion.div>

              {/* Tips */}
              <motion.div variants={itemVariants} className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Travel Tips</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Book restaurants in advance</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Carry a portable charger</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Learn basic local phrases</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Download offline maps</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        )}

        {activeTab === 'itinerary' && (
          <motion.div variants={containerVariants} className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Daily Itinerary</h2>
              <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                <span>Add Activity</span>
              </button>
            </div>
            
            {mockItinerary.map((day, index) => (
              <motion.div
                key={day.day}
                variants={itemVariants}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {day.day}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Day {day.day}</h3>
                    <p className="text-gray-600">{new Date(day.date).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {day.activities.map((activity, actIndex) => {
                    const IconComponent = activity.icon;
                    return (
                      <div key={actIndex} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <IconComponent className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-blue-600">{activity.time}</span>
                            <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                          </div>
                          <p className="text-sm text-gray-600">{activity.location}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'budget' && (
          <motion.div variants={containerVariants} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Budget Breakdown</h2>
            
            {trip.total_budget ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Expense Categories</h3>
                  <div className="space-y-4">
                    {budgetBreakdown.map((item, index) => {
                      const IconComponent = item.icon;
                      return (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                              <IconComponent className={`w-5 h-5 ${item.color}`} />
                            </div>
                            <span className="font-medium text-gray-900">{item.category}</span>
                          </div>
                          <span className="font-bold text-gray-900">{formatCurrency(item.amount)}</span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Budget Summary</h3>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {formatCurrency(trip.total_budget)}
                    </div>
                    <p className="text-gray-600 mb-6">Total Budget</p>
                    <div className="bg-blue-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600">Daily Average</p>
                      <p className="text-xl font-bold text-blue-600">
                        {formatCurrency(trip.total_budget / getDuration())}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            ) : (
              <motion.div variants={itemVariants} className="text-center py-12">
                <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-500 mb-2">No Budget Set</h3>
                <p className="text-gray-400 mb-6">Add a budget to track your expenses</p>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
                  Set Budget
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === 'gallery' && (
          <motion.div variants={containerVariants} className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Photo Gallery</h2>
              <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                <span>Add Photos</span>
              </button>
            </div>
            
            <motion.div variants={itemVariants} className="text-center py-12">
              <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-500 mb-2">No Photos Yet</h3>
              <p className="text-gray-400 mb-6">Start capturing memories of your trip</p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
                Upload Photos
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ModernTripDetails;
