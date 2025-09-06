import React from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

const ItineraryPage = () => {
  return (
    <div className="min-h-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Itinerary Management</h1>
          <p className="text-gray-600 mt-2">Plan your daily activities and manage your travel schedule</p>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="max-w-md mx-auto">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h2>
            <p className="text-gray-600 mb-6">
              We're working on an amazing itinerary management system that will help you plan your daily activities, 
              book accommodations, and organize your travel schedule.
            </p>
            
            {/* Feature Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Daily Planning</h3>
                <p className="text-sm text-gray-600">Create detailed daily schedules</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <MapPin className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Location Mapping</h3>
                <p className="text-sm text-gray-600">Visualize your destinations</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Group Planning</h3>
                <p className="text-sm text-gray-600">Collaborate with travel companions</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Calendar Integration</h3>
                <p className="text-sm text-gray-600">Sync with your calendar apps</p>
              </div>
            </div>
            
            <div className="mt-8">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Get Notified When Available
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryPage;
