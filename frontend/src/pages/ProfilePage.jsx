import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Shield, Calendar, MapPin } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();

  const profileSections = [
    {
      title: 'Personal Information',
      items: [
        { label: 'Full Name', value: user?.name || 'N/A', icon: User },
        { label: 'Email Address', value: user?.email || 'N/A', icon: Mail },
        { label: 'Phone Number', value: user?.number || 'N/A', icon: Phone },
      ]
    },
    {
      title: 'Account Status',
      items: [
        { 
          label: 'Verification Status', 
          value: 'Verified', 
          icon: Shield,
          badge: 'success'
        },
        { 
          label: 'Member Since', 
          value: new Date().toLocaleDateString(), 
          icon: Calendar 
        },
      ]
    }
  ];

  return (
    <div className="min-h-full bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user?.name || 'User Profile'}</h1>
              <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
            </div>
          </div>
        </div>

        {/* Profile Sections */}
        <div className="space-y-6">
          {profileSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {section.items.map((item, itemIndex) => {
                    const Icon = item.icon;
                    return (
                      <div key={itemIndex} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5 text-gray-500" />
                          <span className="font-medium text-gray-700">{item.label}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-900">{item.value}</span>
                          {item.badge === 'success' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Edit Profile
          </button>
          <button className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
