import React from 'react';
import QuickStart from '../components/QuickStart';
import TripStats from '../components/TripStats';
import { TripProvider } from '../context/TripContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, TrendingUp, Plus } from 'lucide-react';

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
      title: 'Trip Calendar',
      description: 'See your travel timeline',
      icon: Calendar,
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => navigate('/dashboard/itinerary')
    },
    {
      title: 'Analytics',
      description: 'View your travel insights',
      icon: TrendingUp,
      color: 'bg-orange-500 hover:bg-orange-600',
      onClick: () => navigate('/dashboard/analytics')
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
