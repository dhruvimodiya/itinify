import React from 'react';
import QuickStart from '../components/QuickStart';
import TripStats from '../components/TripStats';
import { TripProvider } from '../context/TripContext';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  TrendingUp, 
  Plus, 
  User, 
  Settings, 
  Bell,
  Search,
  CheckCircle,
  Globe
} from 'lucide-react';

const DashboardOverview = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Create New Trip',
      description: 'Start planning your next adventure',
      icon: Plus,
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => navigate('/dashboard/trips/create')
    },
    {
      title: 'View All Trips',
      description: 'Manage your existing trips',
      icon: MapPin,
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => navigate('/dashboard/trips')
    },
    {
      title: 'Plan Itinerary',
      description: 'Create detailed travel itineraries',
      icon: Calendar,
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => navigate('/dashboard/itinerary')
    },
    {
      title: 'Google Places',
      description: 'Find places with Google integration',
      icon: Search,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      onClick: () => navigate('/dashboard/plan-trip')
    }
  ];

  const moduleCards = [
    {
      title: 'Trip Management',
      description: 'Create, edit, and manage your travel trips',
      icon: MapPin,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      status: 'Active',
      features: ['Create Trips', 'Edit Details', 'Status Tracking', 'Budget Planning'],
      onClick: () => navigate('/dashboard/trips')
    },
    {
      title: 'Itinerary Planning',
      description: 'Detailed day-by-day trip planning',
      icon: Calendar,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      status: 'Active',
      features: ['Day Planning', 'Activity Scheduling', 'Location Mapping', 'Time Management'],
      onClick: () => navigate('/dashboard/itinerary')
    },
    {
      title: 'Google Places Integration',
      description: 'Find and explore places using Google Places API',
      icon: Globe,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      status: 'Active',
      features: ['Place Search', 'Location Details', 'Reviews & Ratings', 'Photos'],
      onClick: () => navigate('/dashboard/plan-trip')
    },
    {
      title: 'Profile Management',
      description: 'Manage your personal information and preferences',
      icon: User,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      status: 'Active',
      features: ['Personal Info', 'Travel Preferences', 'Account Settings', 'Privacy'],
      onClick: () => navigate('/dashboard/profile')
    },
    {
      title: 'Notifications',
      description: 'Stay updated with travel reminders and alerts',
      icon: Bell,
      color: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      status: 'Active',
      features: ['Trip Reminders', 'Booking Alerts', 'Weather Updates', 'Custom Notifications'],
      onClick: () => navigate('/dashboard/notifications')
    },
    {
      title: 'Settings & Configuration',
      description: 'Customize your travel planning experience',
      icon: Settings,
      color: 'bg-gradient-to-r from-gray-500 to-gray-600',
      status: 'Active',
      features: ['App Preferences', 'Privacy Settings', 'Data Management', 'Export Options'],
      onClick: () => navigate('/dashboard/settings')
    }
  ];

  return (
    <TripProvider>
      <div className="min-h-full bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your trips.</p>
          </div>

          {/* Trip Statistics */}
          <div className="mb-8">
            <TripStats />
          </div>

          {/* Available Modules */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Modules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {moduleCards.map((module, index) => {
                const Icon = module.icon;
                return (
                  <div
                    key={index}
                    onClick={module.onClick}
                    className="cursor-pointer group"
                  >
                    <div className={`${module.color} text-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105`}>
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-white/20 rounded-lg">
                          <Icon className="h-8 w-8" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-300" />
                          <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded-full">
                            {module.status}
                          </span>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <h3 className="font-bold text-lg mb-2">{module.title}</h3>
                      <p className="text-sm opacity-90 mb-4">{module.description}</p>
                      
                      {/* Features */}
                      <div className="space-y-1">
                        {module.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center text-sm opacity-80">
                            <div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>
                            {feature}
                          </div>
                        ))}
                        {module.features.length > 3 && (
                          <div className="text-sm opacity-80">
                            +{module.features.length - 3} more features
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className={`${action.color} text-white p-6 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md transform hover:scale-105`}
                  >
                    <Icon className="h-8 w-8 mb-3" />
                    <h3 className="font-semibold mb-1">{action.title}</h3>
                    <p className="text-sm opacity-90">{action.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* QuickStart Section for new users */}
          <div className="mb-8">
            <QuickStart onNavigateToTrips={() => navigate('/dashboard/trips')} />
          </div>
        </div>
      </div>
    </TripProvider>
  );
};

export default DashboardOverview;
