import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Plane, 
  Clock, 
  Star,
  Filter,
  Search,
  Plus,
  BarChart3,
  Globe,
  Camera,
  Heart,
  Share2
} from 'lucide-react';
import { useTrips } from '../context/TripContext';
import ModernTripCard from './ModernTripCard';
import TripStats from './TripStats';

const TripDashboard = () => {
  const { trips, loading, fetchTrips, tripStats, fetchTripStats } = useTrips();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  useEffect(() => {
    fetchTrips();
    fetchTripStats();
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'trips', label: 'My Trips', icon: MapPin },
    { id: 'planning', label: 'Planning', icon: Calendar },
    { id: 'explore', label: 'Explore', icon: Globe }
  ];

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || trip.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden h-96 bg-gradient-to-r from-travel-brown-600 via-travel-orange-600 to-travel-brown-600">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=600&fit=crop&fm=jpg&q=80")`
          }}
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-travel-brown-800/40 via-travel-orange-500/40 to-travel-brown-800/40"></div>
        
        {/* Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        
        <div className="relative px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 30, opacity: 10 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Your Journey Awaits
            </h1>
            <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
              Discover, plan, and track your adventures with our intelligent travel companion
            </p>
            
            {/* Quick Stats */}
            <div className="flex justify-center space-x-8 text-white">
              <div className="text-center">
                <div className="text-2xl font-bold">{tripStats?.total_trips || 0}</div>
                <div className="text-gray-200">Trips</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{tripStats?.upcoming_trips || 0}</div>
                <div className="text-gray-200">Upcoming</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  ${(tripStats?.total_budget || 0).toLocaleString()}
                </div>
                <div className="text-gray-200">Budget</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-40 bg-travel-brown-1000 backdrop-blur-lg border-b rounded-b-lg border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center space-x-2 py-4 px-1 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-white border-b-2 border-travel-brown-50'
                      : 'text-white'
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-8"
            >
              {/* Trip Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{tripStats?.total_trips || 0}</span>
                  </div>
                  <h3 className="text-gray-600 font-medium">Total Trips</h3>
                  <p className="text-sm text-gray-500">All time adventures</p>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Calendar className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{tripStats?.upcoming_trips || 0}</span>
                  </div>
                  <h3 className="text-gray-600 font-medium">Upcoming</h3>
                  <p className="text-sm text-gray-500">Ready to explore</p>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <DollarSign className="w-6 h-6 text-purple-600" />
                    </div>
                    <span className="text-2xl font-bold text-gray-900">
                      ${(tripStats?.total_budget || 0).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="text-gray-600 font-medium">Total Budget</h3>
                  <p className="text-sm text-gray-500">Investment in memories</p>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-orange-600" />
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{tripStats?.completed_trips || 0}</span>
                  </div>
                  <h3 className="text-gray-600 font-medium">Completed</h3>
                  <p className="text-sm text-gray-500">Beautiful memories</p>
                </motion.div>
              </div>

              {/* Recent Trips Preview */}
              <motion.div variants={itemVariants} className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Recent Adventures</h2>
                  <button 
                    onClick={() => setActiveTab('trips')}
                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
                  >
                    <span>View All</span>
                    <Plane className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trips.slice(0, 3).map((trip, index) => (
                    <motion.div
                      key={trip.trip_id}
                      variants={itemVariants}
                      className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm border border-white/30 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{trip.destination}</h3>
                            <p className="text-sm text-gray-600">
                              {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            trip.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                            trip.status === 'ongoing' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {trip.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{trip.duration_days} days</span>
                          </div>
                          {trip.total_budget && (
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-4 h-4" />
                              <span>${trip.total_budget.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Trips Tab */}
          {activeTab === 'trips' && (
            <motion.div
              key="trips"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-6"
            >
              {/* Search and Filter Bar */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search destinations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex items-center space-x-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-3 bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Trips</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                  
                  <button className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>

              {/* Trips Grid */}
              <motion.div 
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredTrips.map((trip) => (
                  <motion.div key={trip.trip_id} variants={itemVariants}>
                    <ModernTripCard trip={trip} />
                  </motion.div>
                ))}
              </motion.div>

              {filteredTrips.length === 0 && (
                <motion.div 
                  variants={itemVariants}
                  className="text-center py-12"
                >
                  <Plane className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-500 mb-2">No trips found</h3>
                  <p className="text-gray-400">Start planning your next adventure!</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Planning Tab */}
          {activeTab === 'planning' && (
            <motion.div
              key="planning"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-8"
            >
              <motion.div variants={itemVariants} className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Plan Your Next Adventure</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Use our AI-powered planning tools to create the perfect itinerary
                </p>
              </motion.div>

              {/* Planning Tools */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div variants={itemVariants} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300">
                  <div className="p-3 bg-blue-500 rounded-lg w-fit mb-4">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Scheduling</h3>
                  <p className="text-gray-600 mb-4">AI-optimized itineraries based on your preferences</p>
                  <button className="text-blue-600 font-medium hover:text-blue-700">
                    Start Planning →
                  </button>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 hover:shadow-lg transition-all duration-300">
                  <div className="p-3 bg-purple-500 rounded-lg w-fit mb-4">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Budget Optimizer</h3>
                  <p className="text-gray-600 mb-4">Get the most value from your travel budget</p>
                  <button className="text-purple-600 font-medium hover:text-purple-700">
                    Optimize Budget →
                  </button>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 hover:shadow-lg transition-all duration-300">
                  <div className="p-3 bg-green-500 rounded-lg w-fit mb-4">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Destination Finder</h3>
                  <p className="text-gray-600 mb-4">Discover hidden gems and popular destinations</p>
                  <button className="text-green-600 font-medium hover:text-green-700">
                    Explore Destinations →
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Explore Tab */}
          {activeTab === 'explore' && (
            <motion.div
              key="explore"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-8"
            >
              <motion.div variants={itemVariants} className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Discover Amazing Destinations</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Find inspiration for your next journey from our curated collection
                </p>
              </motion.div>

              {/* Featured Destinations */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {['Paris, France', 'Tokyo, Japan', 'New York, USA', 'Bali, Indonesia', 'London, UK', 'Sydney, Australia'].map((destination, index) => (
                  <motion.div
                    key={destination}
                    variants={itemVariants}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 h-64 cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-white text-xl font-bold mb-2">{destination}</h3>
                      <p className="text-gray-300 text-sm mb-4">Discover the magic of this incredible destination</p>
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-2 text-white hover:text-blue-300 transition-colors">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">Save</span>
                        </button>
                        <button className="flex items-center space-x-2 text-white hover:text-blue-300 transition-colors">
                          <Share2 className="w-4 h-4" />
                          <span className="text-sm">Share</span>
                        </button>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TripDashboard;
