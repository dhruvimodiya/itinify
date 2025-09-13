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
  Share2,
  Compass,
  Mountain,
  TreePine,
  Backpack,
  Map,
  Sun
} from 'lucide-react';
import { useTrips } from '../context/TripContext';
import ModernTripCard from './ModernTripCard';
import ModernTripForm from './ModernTripForm';
import ModernTripDetails from './ModernTripDetails';
import TripStats from './TripStats';

const TripDashboard = () => {
  const { trips, loading, fetchTrips, tripStats, fetchTripStats, deleteTrip } = useTrips();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  
  // Modal states
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchTrips();
    fetchTripStats();
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'trips', label: 'My Journeys', icon: Backpack },
    { id: 'planning', label: 'Planning', icon: Compass },
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

  // Handler functions for trip actions
  const handleEditTrip = (trip) => {
    setSelectedTrip(trip);
    setShowEditForm(true);
  };

  const handleCreateTrip = () => {
    setSelectedTrip(null);
    setShowEditForm(true);
  };

  const handleDeleteTrip = (trip) => {
    setSelectedTrip(trip);
    setShowDeleteConfirm(true);
  };

  const handleViewTrip = (trip) => {
    setSelectedTrip(trip);
    setShowDetails(true);
  };

  const confirmDeleteTrip = async () => {
    if (selectedTrip) {
      try {
        await deleteTrip(selectedTrip.trip_id);
        setShowDeleteConfirm(false);
        setSelectedTrip(null);
        // Refresh data
        fetchTrips();
        fetchTripStats();
      } catch (error) {
        console.error('Error deleting trip:', error);
        // You might want to show a toast notification here
      }
    }
  };

  const handleFormSuccess = () => {
    setShowEditForm(false);
    setSelectedTrip(null);
    // Refresh data
    fetchTrips();
    fetchTripStats();
  };

  const handleCloseModals = () => {
    setShowEditForm(false);
    setShowDetails(false);
    setShowDeleteConfirm(false);
    setSelectedTrip(null);
  };

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #f5f1eb 0%, #ede3d3 50%, #e8dcc6 100%)'
    }}>
      {/* Hero Section */}
      <div className="relative overflow-hidden h-96 bg-gradient-to-r from-amber-800 via-orange-600 to-amber-800">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=600&fit=crop&fm=jpg&q=80")`
          }}
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-amber-900/60"></div>
        
        {/* Travel-themed decorative elements */}
        <div className="absolute top-6 left-6">
          <div className="flex space-x-3">
            <div className="p-2 bg-amber-100/20 backdrop-blur-sm rounded-full">
              <Compass className="w-5 h-5 text-amber-100" />
            </div>
            <div className="p-2 bg-amber-100/20 backdrop-blur-sm rounded-full">
              <Mountain className="w-5 h-5 text-amber-100" />
            </div>
            <div className="p-2 bg-amber-100/20 backdrop-blur-sm rounded-full">
              <TreePine className="w-5 h-5 text-amber-100" />
            </div>
          </div>
        </div>
        
        <div className="relative px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 flex items-center justify-center gap-4">
              <Map className="w-16 h-16 text-amber-200" />
              Your Journey Awaits
              <Backpack className="w-16 h-16 text-amber-200" />
            </h1>
            <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
              Discover, plan, and track your adventures with our intelligent travel companion
            </p>
            
            {/* Quick Stats */}
            <div className="flex justify-center space-x-8 text-white">
              <div className="text-center bg-amber-100/20 backdrop-blur-sm rounded-xl p-4 border border-amber-200/30">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Plane className="w-5 h-5 text-amber-200" />
                  <div className="text-2xl font-bold">{tripStats?.total_trips || 0}</div>
                </div>
                <div className="text-amber-200">Journeys</div>
              </div>
              <div className="text-center bg-amber-100/20 backdrop-blur-sm rounded-xl p-4 border border-amber-200/30">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sun className="w-5 h-5 text-amber-200" />
                  <div className="text-2xl font-bold">{tripStats?.upcoming_trips || 0}</div>
                </div>
                <div className="text-amber-200">Upcoming</div>
              </div>
              <div className="text-center bg-amber-100/20 backdrop-blur-sm rounded-xl p-4 border border-amber-200/30">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-amber-200" />
                  <div className="text-2xl font-bold">
                    ${(tripStats?.total_budget || 0).toLocaleString()}
                  </div>
                </div>
                <div className="text-amber-200">Budget</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-40 bg-amber-50/95 backdrop-blur-lg border-b border-amber-200">
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
                      ? 'text-amber-800 border-b-2 border-amber-600'
                      : 'text-amber-700 hover:text-amber-900'
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
                <motion.div variants={itemVariants} className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-amber-200 rounded-lg">
                      <MapPin className="w-6 h-6 text-amber-800" />
                    </div>
                    <span className="text-2xl font-bold text-amber-900">{tripStats?.total_trips || 0}</span>
                  </div>
                  <h3 className="text-amber-800 font-medium">Total Journeys</h3>
                  <p className="text-sm text-amber-700">All time adventures</p>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-emerald-200 rounded-lg">
                      <Calendar className="w-6 h-6 text-emerald-800" />
                    </div>
                    <span className="text-2xl font-bold text-emerald-900">{tripStats?.upcoming_trips || 0}</span>
                  </div>
                  <h3 className="text-emerald-800 font-medium">Upcoming</h3>
                  <p className="text-sm text-emerald-700">Ready to explore</p>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl p-6 border border-stone-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-stone-200 rounded-lg">
                      <DollarSign className="w-6 h-6 text-stone-800" />
                    </div>
                    <span className="text-2xl font-bold text-stone-900">
                      ${(tripStats?.total_budget || 0).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="text-stone-800 font-medium">Total Budget</h3>
                  <p className="text-sm text-stone-700">Investment in memories</p>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-orange-200 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-orange-800" />
                    </div>
                    <span className="text-2xl font-bold text-orange-900">{tripStats?.completed_trips || 0}</span>
                  </div>
                  <h3 className="text-orange-800 font-medium">Completed</h3>
                  <p className="text-sm text-orange-700">Beautiful memories</p>
                </motion.div>
              </div>

              {/* Recent Trips Preview */}
              <motion.div variants={itemVariants} className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-8 border border-amber-200/50 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-amber-900 flex items-center gap-3">
                    <TreePine className="w-6 h-6 text-amber-600" />
                    Recent Adventures
                  </h2>
                  <button 
                    onClick={() => setActiveTab('trips')}
                    className="text-amber-700 hover:text-amber-800 font-medium flex items-center space-x-1"
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
                      className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white/90 to-amber-50/80 backdrop-blur-sm border border-amber-200/50 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-amber-900 mb-1">{trip.destination}</h3>
                            <p className="text-sm text-amber-700">
                              {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            trip.status === 'upcoming' ? 'bg-amber-100 text-amber-800' :
                            trip.status === 'ongoing' ? 'bg-emerald-100 text-emerald-800' :
                            'bg-stone-100 text-stone-800'
                          }`}>
                            {trip.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-amber-800">
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
                      
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-600/5 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search destinations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-amber-50/70 backdrop-blur-sm border border-amber-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex items-center space-x-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-3 bg-amber-50/70 backdrop-blur-sm border border-amber-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="all">All Journeys</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                  
                  <button 
                    onClick={handleCreateTrip}
                    className="p-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors shadow-lg hover:shadow-xl"
                  >
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
                    <ModernTripCard 
                      trip={trip}
                      onEdit={handleEditTrip}
                      onDelete={handleDeleteTrip}
                      onView={handleViewTrip}
                      showActions={true}
                    />
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

      {/* Edit Trip Modal */}
      <AnimatePresence>
        {showEditForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseModals}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <ModernTripForm
                trip={selectedTrip}
                onSuccess={handleFormSuccess}
                onCancel={handleCloseModals}
                isModal={true}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trip Details Modal */}
      <AnimatePresence>
        {showDetails && selectedTrip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseModals}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <ModernTripDetails
                trip={selectedTrip}
                onClose={handleCloseModals}
                onEdit={() => {
                  setShowDetails(false);
                  setShowEditForm(true);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && selectedTrip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseModals}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Trip</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to delete "{selectedTrip.destination}"? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={handleCloseModals}
                    className="flex-1 bg-gray-100 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteTrip}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TripDashboard;
