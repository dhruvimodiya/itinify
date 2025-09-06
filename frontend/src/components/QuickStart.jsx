import React from 'react';
import { MapPin, Calendar, DollarSign, TrendingUp } from 'lucide-react';

const QuickStart = ({ onNavigateToTrips }) => {
  const features = [
    {
      icon: MapPin,
      title: 'Plan Destinations',
      description: 'Add your dream destinations and create detailed travel itineraries.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Calendar,
      title: 'Schedule Trips',
      description: 'Set dates for your trips and keep track of upcoming adventures.',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: DollarSign,
      title: 'Budget Planning',
      description: 'Set budgets for your trips and monitor your travel expenses.',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your travel statistics and see your journey unfold.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Itinify</h2>
        <p className="text-gray-600 mb-6">
          Your personal travel planning companion. Start organizing your trips and create unforgettable memories.
        </p>
        
        <button
          onClick={onNavigateToTrips}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-lg font-medium"
        >
          <MapPin className="h-5 w-5 mr-2" />
          Start Planning Your Trip
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className={`${feature.bgColor} rounded-lg p-6 text-center transition-transform hover:scale-105`}
            >
              <div className="flex justify-center mb-4">
                <Icon className={`h-8 w-8 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          Ready to start your journey?
        </h3>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onNavigateToTrips}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Your First Trip
          </button>
          <button
            onClick={onNavigateToTrips}
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Explore Trip Manager
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickStart;
