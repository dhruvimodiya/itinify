import React, { useState } from 'react';
import { Settings, Bell, Shield, Palette, Globe, Database, Save, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const SettingsPage = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    tripReminders: true,
    marketingEmails: false,
    twoFactorAuth: false,
    dataSharing: false,
    profileVisibility: 'Private',
    theme: 'Light',
    language: 'English',
    autoBackup: true,
    offlineData: false
  });

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSelectChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been successfully updated.",
    });
  };

  const handleReset = () => {
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to their default values.",
      variant: "destructive",
    });
  };
  const settingSections = [
    {
      title: 'Notifications',
      icon: Bell,
      description: 'Manage your notification preferences',
      settings: [
        { 
          label: 'Email Notifications', 
          key: 'emailNotifications',
          type: 'toggle', 
          enabled: settings.emailNotifications,
          description: 'Receive email updates about your trips'
        },
        { 
          label: 'Trip Reminders', 
          key: 'tripReminders',
          type: 'toggle', 
          enabled: settings.tripReminders,
          description: 'Get reminded about upcoming trips'
        },
        { 
          label: 'Marketing Emails', 
          key: 'marketingEmails',
          type: 'toggle', 
          enabled: settings.marketingEmails,
          description: 'Receive promotional offers and updates'
        },
      ]
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      description: 'Control your privacy and security settings',
      settings: [
        { 
          label: 'Two-Factor Authentication', 
          key: 'twoFactorAuth',
          type: 'toggle', 
          enabled: settings.twoFactorAuth,
          description: 'Add an extra layer of security to your account'
        },
        { 
          label: 'Data Sharing', 
          key: 'dataSharing',
          type: 'toggle', 
          enabled: settings.dataSharing,
          description: 'Allow sharing anonymized data for service improvement'
        },
        { 
          label: 'Profile Visibility', 
          key: 'profileVisibility',
          type: 'select', 
          value: settings.profileVisibility, 
          options: ['Public', 'Friends', 'Private'],
          description: 'Control who can see your profile information'
        },
      ]
    },
    {
      title: 'Appearance',
      icon: Palette,
      description: 'Customize the look and feel',
      settings: [
        { 
          label: 'Theme', 
          key: 'theme',
          type: 'select', 
          value: settings.theme, 
          options: ['Light', 'Dark', 'Auto'],
          description: 'Choose your preferred color scheme'
        },
        { 
          label: 'Language', 
          key: 'language',
          type: 'select', 
          value: settings.language, 
          options: ['English', 'Spanish', 'French'],
          description: 'Select your preferred language'
        },
      ]
    },
    {
      title: 'Data & Storage',
      icon: Database,
      description: 'Manage your data and storage preferences',
      settings: [
        { 
          label: 'Auto-backup', 
          key: 'autoBackup',
          type: 'toggle', 
          enabled: settings.autoBackup,
          description: 'Automatically backup your data to the cloud'
        },
        { 
          label: 'Offline Data', 
          key: 'offlineData',
          type: 'toggle', 
          enabled: settings.offlineData,
          description: 'Store data locally for offline access'
        },
      ]
    }
  ];

  const renderSetting = (setting) => {
    switch (setting.type) {
      case 'toggle':
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggle(setting.key)}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors p-0",
              setting.enabled ? 'bg-travel-brown-600' : 'bg-gray-200'
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                setting.enabled ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </Button>
        );
      case 'select':
        return (
          <select 
            value={setting.value}
            onChange={(e) => handleSelectChange(setting.key, e.target.value)}
            className="bg-white border border-travel-brown-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-travel-brown-500 focus:border-travel-brown-500"
          >
            {setting.options?.map(option => (
              <option key={option} value={option}>
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
          <Card className="bg-gradient-to-r from-travel-brown-600 to-travel-brown-700 text-white border-0">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-white flex items-center">
                <Settings className="mr-3" size={32} />
                Settings
              </CardTitle>
              <CardDescription className="text-travel-brown-100 text-lg">
                Manage your account preferences and application settings
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6 mb-8">
          {settingSections.map((section, sectionIndex) => {
            const Icon = section.icon;
            return (
              <Card key={sectionIndex} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-travel-brown-100 rounded-lg">
                      <Icon className="h-6 w-6 text-travel-brown-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold text-travel-brown-800">
                        {section.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        {section.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {section.settings.map((setting, settingIndex) => (
                      <div key={settingIndex}>
                        <div className="flex items-center justify-between py-3">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <label className="text-sm font-medium text-gray-900">
                                  {setting.label}
                                </label>
                                <p className="text-xs text-gray-500 mt-1">
                                  {setting.description}
                                </p>
                              </div>
                              <div className="ml-4">
                                {renderSetting(setting)}
                              </div>
                            </div>
                          </div>
                        </div>
                        {settingIndex < section.settings.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-travel-brown-800">
              Save Changes
            </CardTitle>
            <CardDescription>
              Apply your settings or reset to default values
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleSave}
                className="bg-travel-brown-600 hover:bg-travel-brown-700 text-white"
                size="lg"
              >
                <Save size={18} className="mr-2" />
                Save Changes
              </Button>
              <Button 
                variant="outline"
                onClick={handleReset}
                size="lg"
                className="border-travel-brown-300 hover:bg-travel-brown-50"
              >
                <RotateCcw size={18} className="mr-2" />
                Reset to Defaults
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
