import React, { useEffect } from 'react';
import { 
  MapPin, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Clock,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useTrips } from '../context/TripContext';

const TripStats = ({ className = '' }) => {
  const {
    tripStats,
    loading,
    error,
    fetchTripStats,
    clearError,
  } = useTrips();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      await fetchTripStats();
    } catch (error) {
      console.error('Error loading trip stats:', error);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount || amount === 0) {
      return '$0';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Error state
  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-red-800">Error loading statistics</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-3">
              <button
                onClick={() => {
                  clearError();
                  loadStats();
                }}
                className="inline-flex items-center px-3 py-2 bg-red-100 text-red-800 text-sm rounded-md hover:bg-red-200 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading && !tripStats) {
    return (
      <div className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-12 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // No stats available
  if (!tripStats) {
    return (
      <div className={`bg-gray-50 border border-gray-200 rounded-lg p-6 text-center ${className}`}>
        <TrendingUp className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-gray-600 text-sm">No trip statistics available</p>
        <button
          onClick={loadStats}
          className="mt-2 inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Load Stats
        </button>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Trips',
      value: tripStats.total_trips || 0,
      icon: MapPin,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      label: 'Total Budget',
      value: formatCurrency(tripStats.total_budget || 0),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      label: 'Upcoming',
      value: tripStats.upcoming_trips || 0,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      label: 'Ongoing',
      value: tripStats.ongoing_trips || 0,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
    {
      label: 'Completed',
      value: tripStats.completed_trips || 0,
      icon: TrendingUp,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
    },
  ];

  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Trip Statistics</h2>
          <button
            onClick={loadStats}
            disabled={loading}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh statistics"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`${stat.bgColor} ${stat.borderColor} border rounded-lg p-4 transition-all duration-200 hover:shadow-md`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Insights */}
        {(tripStats.total_trips > 0) && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Insights</h3>
            <div className="space-y-2 text-sm text-gray-600">
              {tripStats.upcoming_trips > 0 && (
                <p>
                  • You have {tripStats.upcoming_trips} upcoming trip{tripStats.upcoming_trips !== 1 ? 's' : ''} planned
                </p>
              )}
              {tripStats.ongoing_trips > 0 && (
                <p>
                  • You are currently on {tripStats.ongoing_trips} trip{tripStats.ongoing_trips !== 1 ? 's' : ''}
                </p>
              )}
              {tripStats.completed_trips > 0 && (
                <p>
                  • You have completed {tripStats.completed_trips} trip{tripStats.completed_trips !== 1 ? 's' : ''}
                </p>
              )}
              {tripStats.total_budget > 0 && (
                <p>
                  • Average budget per trip: {formatCurrency(tripStats.total_budget / tripStats.total_trips)}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {tripStats.total_trips === 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <div className="text-gray-400 mb-2">
              <MapPin className="mx-auto h-8 w-8" />
            </div>
            <p className="text-sm text-gray-600 mb-2">No trips yet</p>
            <p className="text-xs text-gray-500">Start planning your first trip to see statistics here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripStats;
