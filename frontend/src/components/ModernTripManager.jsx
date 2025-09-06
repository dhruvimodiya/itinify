import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus,
  Grid3X3,
  List,
  Filter,
  Search,
  SortAsc,
  BarChart3,
  MapPin,
  Calendar,
  TrendingUp,
  Plane,
  X,
  ChevronDown
} from 'lucide-react';
import { useTrips } from '../context/TripContext';
import ModernTripCard from './ModernTripCard';
import ModernTripForm from './ModernTripForm';
import ModernTripDetails from './ModernTripDetails';

const ModernTripManager = ({ initialView = 'dashboard', initialFilter = 'all' }) => {
  const {
    trips,
    loading,
    error,
    fetchTrips,
    deleteTrip,
    tripStats,
    fetchTripStats
  } = useTrips();

  // UI State
  const [currentView, setCurrentView] = useState(initialView);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState(initialFilter);
  const [sortBy, setSortBy] = useState('start_date');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchTrips();
    fetchTripStats();
  }, []);

  // Filter and sort trips
  const filteredTrips = trips
    .filter(trip => {
      const matchesSearch = trip.destination.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'all' || trip.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'start_date':
          return new Date(b.start_date) - new Date(a.start_date);
        case 'destination':
          return a.destination.localeCompare(b.destination);
        case 'budget':
          return (b.total_budget || 0) - (a.total_budget || 0);
        default:
          return 0;
      }
    });

  const views = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'trips', label: 'My Trips', icon: MapPin },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  const handleCreateTrip = () => {
    setShowCreateForm(true);
    setSelectedTrip(null);
  };

  const handleEditTrip = (trip) => {
    setSelectedTrip(trip);
    setShowCreateForm(true);
  };

  const handleViewTrip = (trip) => {
    setSelectedTrip(trip);
    setCurrentView('details');
  };

  const handleDeleteTrip = async (trip) => {
    setShowDeleteConfirm(trip);
  };

  const confirmDelete = async () => {
    if (showDeleteConfirm) {
      try {
        await deleteTrip(showDeleteConfirm.trip_id);
        setShowDeleteConfirm(null);
      } catch (error) {
        console.error('Error deleting trip:', error);
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
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

  const StatCard = ({ title, value, icon: IconComponent, color, change }) => (
    <motion.div
      variants={itemVariants}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {change && (
            <p className="text-white/90 text-sm mt-2 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              {change}
            </p>
          )}
        </div>
        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
          <IconComponent className="w-8 h-8" />
        </div>
      </div>
      <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-white/10 rounded-full"></div>
      <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full"></div>
    </motion.div>
  );

  if (showCreateForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  {selectedTrip ? 'Edit Trip' : 'Create New Trip'}
                </h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              <ModernTripForm
                trip={selectedTrip}
                onSuccess={() => {
                  setShowCreateForm(false);
                  setSelectedTrip(null);
                  fetchTrips();
                }}
                onCancel={() => {
                  setShowCreateForm(false);
                  setSelectedTrip(null);
                }}
                isModal={true}
              />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (currentView === 'details' && selectedTrip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Trip Details</h2>
                <button
                  onClick={() => {
                    setCurrentView('trips');
                    setSelectedTrip(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              <ModernTripDetails 
                trip={selectedTrip} 
                onEdit={handleEditTrip}
                onBack={() => {
                  setCurrentView('trips');
                  setSelectedTrip(null);
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Navigation */}
            <div className="flex items-center space-x-8">
              {views.map((view) => {
                const IconComponent = view.icon;
                return (
                  <button
                    key={view.id}
                    onClick={() => setCurrentView(view.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      currentView === view.id
                        ? 'bg-blue-100 text-blue-700 shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{view.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Create Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateTrip}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              <span>New Trip</span>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {/* Dashboard View */}
          {currentView === 'dashboard' && (
            <motion.div
              key="dashboard"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-8"
            >
              {/* Hero Section */}
              <motion.div variants={itemVariants} className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Welcome Back, Traveler!
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Your next adventure is just a click away. Explore your trips, track your journeys, and create unforgettable memories.
                </p>
              </motion.div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatCard
                  title="Total Trips"
                  value={tripStats?.total_trips || 0}
                  icon={MapPin}
                  color="from-blue-500 to-blue-600"
                  change="+2 this month"
                />
                <StatCard
                  title="Upcoming"
                  value={tripStats?.upcoming_trips || 0}
                  icon={Calendar}
                  color="from-green-500 to-green-600"
                  change="Next: Paris"
                />
                <StatCard
                  title="Total Budget"
                  value={`$${(tripStats?.total_budget || 0).toLocaleString()}`}
                  icon={TrendingUp}
                  color="from-purple-500 to-purple-600"
                  change="+15% vs last year"
                />
                <StatCard
                  title="Countries"
                  value="12"
                  icon={Plane}
                  color="from-orange-500 to-orange-600"
                  change="3 new this year"
                />
              </div>

              {/* Recent Trips */}
              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Recent Adventures</h2>
                  <button
                    onClick={() => setCurrentView('trips')}
                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
                  >
                    <span>View All</span>
                    <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trips.slice(0, 3).map((trip) => (
                    <ModernTripCard
                      key={trip.trip_id}
                      trip={trip}
                      onEdit={handleEditTrip}
                      onDelete={handleDeleteTrip}
                      onView={handleViewTrip}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Trips View */}
          {currentView === 'trips' && (
            <motion.div
              key="trips"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-6"
            >
              {/* Search and Filter Bar */}
              <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                  {/* Search */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search destinations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  {/* Filters */}
                  <div className="flex items-center space-x-3">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      <option value="all">All Trips</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                    </select>
                    
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      <option value="start_date">Sort by Date</option>
                      <option value="destination">Sort by Destination</option>
                      <option value="budget">Sort by Budget</option>
                    </select>
                    
                    {/* View Mode Toggle */}
                    <div className="flex items-center bg-gray-100 rounded-xl p-1">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
                        }`}
                      >
                        <Grid3X3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
                        }`}
                      >
                        <List className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Trips Grid/List */}
              <motion.div 
                variants={containerVariants}
                className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}
              >
                {filteredTrips.map((trip) => (
                  <motion.div key={trip.trip_id} variants={itemVariants}>
                    <ModernTripCard
                      trip={trip}
                      onEdit={handleEditTrip}
                      onDelete={handleDeleteTrip}
                      onView={handleViewTrip}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* Empty State */}
              {filteredTrips.length === 0 && (
                <motion.div 
                  variants={itemVariants}
                  className="text-center py-20"
                >
                  <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 border border-white/20 shadow-lg">
                    <Plane className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-2xl font-semibold text-gray-500 mb-4">No trips found</h3>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">
                      {searchQuery || filterStatus !== 'all' 
                        ? 'Try adjusting your search or filter criteria'
                        : 'Start planning your next adventure and create your first trip!'
                      }
                    </p>
                    <button
                      onClick={handleCreateTrip}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Create Your First Trip
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Other views can be added here */}
          {currentView === 'calendar' && (
            <motion.div
              key="calendar"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="text-center py-20"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Calendar View</h2>
              <p className="text-gray-600">Coming soon - visualize your trips on a calendar</p>
            </motion.div>
          )}

          {currentView === 'analytics' && (
            <motion.div
              key="analytics"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="text-center py-20"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Analytics</h2>
              <p className="text-gray-600">Coming soon - detailed analytics about your travels</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Trip</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{showDeleteConfirm.destination}"? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModernTripManager;
