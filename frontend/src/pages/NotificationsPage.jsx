import React from 'react';
import { Bell, Check, Clock, AlertCircle } from 'lucide-react';

const NotificationsPage = () => {
  const notifications = [
    {
      id: 1,
      type: 'trip-reminder',
      title: 'Trip to Paris starting soon',
      message: 'Your trip to Paris, France starts in 3 days. Don\'t forget to check your passport!',
      time: '2 hours ago',
      read: false,
      icon: Clock,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 2,
      type: 'update',
      title: 'Profile updated successfully',
      message: 'Your profile information has been updated.',
      time: '1 day ago',
      read: true,
      icon: Check,
      color: 'text-green-600 bg-green-100'
    },
    {
      id: 3,
      type: 'alert',
      title: 'Weather alert for Tokyo trip',
      message: 'Heavy rain expected during your Tokyo trip. Consider packing an umbrella.',
      time: '2 days ago',
      read: false,
      icon: AlertCircle,
      color: 'text-yellow-600 bg-yellow-100'
    }
  ];

  return (
    <div className="min-h-full bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600 mt-2">Stay updated with your travel plans and account activity</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Mark all as read
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600">You're all caught up! Check back later for new updates.</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex space-x-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${notification.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="ml-4">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
