import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Shield, Calendar, MapPin, Edit, Lock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

const ProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleEditProfile = () => {
    toast({
      title: "Edit Profile",
      description: "Profile editing functionality coming soon!",
    });
  };

  const handleChangePassword = () => {
    toast({
      title: "Change Password",
      description: "Password change functionality coming soon!",
    });
  };

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
          <Card className="bg-gradient-to-r from-travel-brown-600 to-travel-brown-700 text-white border-0">
            <CardHeader>
              <div className="flex items-center space-x-6">
                <Avatar className="w-20 h-20 border-4 border-white/20">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-white/20 text-white text-2xl font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-3xl font-bold text-white mb-2">
                    {user?.name || 'User Profile'}
                  </CardTitle>
                  <CardDescription className="text-travel-brown-100 text-lg">
                    Manage your account information and preferences
                  </CardDescription>
                  <div className="flex items-center mt-3 space-x-4">
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      Premium Member
                    </Badge>
                    <div className="flex items-center text-travel-brown-100">
                      <CheckCircle size={16} className="mr-1" />
                      <span className="text-sm">Account Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Profile Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {profileSections.map((section, sectionIndex) => (
            <Card key={sectionIndex} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-travel-brown-800">
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {section.items.map((item, itemIndex) => {
                    const Icon = item.icon;
                    return (
                      <div key={itemIndex}>
                        <div className="flex items-center justify-between py-3">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-travel-brown-100 rounded-lg">
                              <Icon className="h-5 w-5 text-travel-brown-600" />
                            </div>
                            <span className="font-medium text-gray-700">{item.label}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-900 font-medium">{item.value}</span>
                            {item.badge === 'success' && (
                              <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                                <CheckCircle size={12} className="mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                        {itemIndex < section.items.length - 1 && <Separator />}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Information Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-travel-brown-800">
              Travel Preferences
            </CardTitle>
            <CardDescription>
              Customize your travel planning experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Preferred Currency</span>
                  <Badge variant="outline">USD ($)</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Time Zone</span>
                  <Badge variant="outline">UTC-5 (EST)</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Notification Preference</span>
                  <Badge variant="outline">Email + Push</Badge>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Language</span>
                  <Badge variant="outline">English</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Theme</span>
                  <Badge variant="outline">Light</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Privacy Level</span>
                  <Badge variant="outline">Standard</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-travel-brown-800">
              Account Actions
            </CardTitle>
            <CardDescription>
              Manage your account settings and security
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                onClick={handleEditProfile}
                className="bg-travel-brown-600 hover:bg-travel-brown-700 text-white"
                size="lg"
              >
                <Edit size={18} className="mr-2" />
                Edit Profile
              </Button>
              <Button 
                variant="outline"
                onClick={handleChangePassword}
                size="lg"
                className="border-travel-brown-300 hover:bg-travel-brown-50"
              >
                <Lock size={18} className="mr-2" />
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
