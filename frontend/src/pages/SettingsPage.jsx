import React from 'react';
import { Settings, Bell, Shield, Palette, Globe, Database } from 'lucide-react';

const SettingsPage = () => {
  const settingSections = [
    {
      title: 'Notifications',
      icon: Bell,
      description: 'Manage your notification preferences',
      settings: [
        { label: 'Email Notifications', type: 'toggle', enabled: true },
        { label: 'Trip Reminders', type: 'toggle', enabled: true },
        { label: 'Marketing Emails', type: 'toggle', enabled: false },
      ]
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      description: 'Control your privacy and security settings',
      settings: [
        { label: 'Two-Factor Authentication', type: 'toggle', enabled: false },
        { label: 'Data Sharing', type: 'toggle', enabled: false },
        { label: 'Profile Visibility', type: 'select', value: 'Private', options: ['Public', 'Friends', 'Private'] },
      ]
    },
    {
      title: 'Appearance',
      icon: Palette,
      description: 'Customize the look and feel',
      settings: [
        { label: 'Theme', type: 'select', value: 'Light', options: ['Light', 'Dark', 'Auto'] },
        { label: 'Language', type: 'select', value: 'English', options: ['English', 'Spanish', 'French'] },
      ]
    },
    {
      title: 'Data & Storage',
      icon: Database,
      description: 'Manage your data and storage preferences',
      settings: [
        { label: 'Auto-backup', type: 'toggle', enabled: true },
        { label: 'Offline Data', type: 'toggle', enabled: false },
      ]
    }
  ];

  const renderSetting = (setting) => {
    switch (setting.type) {
      case 'toggle':
        return (
          <div className="flex items-center">
            <button
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                setting.enabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  setting.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        );
      case 'select':
        return (
          <select className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            {setting.options?.map(option => (
              <option key={option} value={option} selected={option === setting.value}>
                {option}
              </option>
            ))}
          </select>
        );
      default:
        return <span className="text-gray-500">-</span>;
    }
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account preferences and application settings</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {settingSections.map((section, sectionIndex) => {
            const Icon = section.icon;
            return (
              <div key={sectionIndex} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-gray-600" />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
                      <p className="text-sm text-gray-600">{section.description}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {section.settings.map((setting, settingIndex) => (
                      <div key={settingIndex} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                        <div>
                          <label className="text-sm font-medium text-gray-700">{setting.label}</label>
                        </div>
                        {renderSetting(setting)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Save Changes
          </button>
          <button className="border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
