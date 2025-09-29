import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import QuickStart from '../components/QuickStart';
import TripStats from '../components/TripStats';
import ShadcnModernTripCard from '../components/ShadcnModernTripCard';
import { TripProvider } from '../context/TripContext';
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
  Globe,
  Plane,
  ArrowRight,
  DollarSign,
  Clock
} from 'lucide-react';

const DashboardOverview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const quickActions = [
    {
      title: 'Create New Trip',
      description: 'Start planning your next adventure',
      icon: Plus,
      color: 'bg-travel-brown-600 hover:bg-travel-brown-700',
      onClick: () => {
        navigate('/dashboard/trips/create');
        toast({
          title: "Creating New Trip",
          description: "Redirecting to trip creation page...",
        });
      }
    },
    {
      title: 'View All Trips',
      description: 'Manage your existing trips',
      icon: MapPin,
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => {
        navigate('/dashboard/trips');
        toast({
          title: "Loading Trips",
          description: "Viewing all your trips...",
        });
      }
    },
    {
      title: 'Plan Itinerary',
      description: 'Create detailed travel itineraries',
      icon: Calendar,
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => {
        navigate('/dashboard/itinerary');
        toast({
          title: "Itinerary Planner",
          description: "Opening itinerary planning tools...",
        });
      }
    },
    {
      title: 'Google Places',
      description: 'Find places with Google integration',
      icon: Search,
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => {
        navigate('/dashboard/plan-trip');
        toast({
          title: "Google Places",
          description: "Accessing place search functionality...",
        });
      }
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
      onClick: () => {
        navigate('/dashboard/trips');
        toast({
          title: "Trip Management",
          description: "Loading trip management interface...",
        });
      }
    },
    {
      title: 'Itinerary Planning',
      description: 'Detailed day-by-day trip planning',
      icon: Calendar,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      status: 'Active',
      features: ['Day Planning', 'Activity Scheduling', 'Location Mapping', 'Time Management'],
      onClick: () => {
        navigate('/dashboard/itinerary');
        toast({
          title: "Itinerary Planning",
          description: "Opening itinerary planning tools...",
        });
      }
    },
    {
      title: 'Google Places Integration',
      description: 'Find and explore places using Google Places API',
      icon: Globe,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      status: 'Active',
      features: ['Place Search', 'Location Details', 'Reviews & Ratings', 'Photos'],
      onClick: () => {
        navigate('/dashboard/plan-trip');
        toast({
          title: "Google Places",
          description: "Accessing Google Places integration...",
        });
      }
    },
    {
      title: 'Profile Management',
      description: 'Manage your personal information and preferences',
      icon: User,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      status: 'Active',
      features: ['Personal Info', 'Travel Preferences', 'Account Settings', 'Privacy'],
      onClick: () => {
        navigate('/dashboard/profile');
        toast({
          title: "Profile Management",
          description: "Opening your profile settings...",
        });
      }
    },
    {
      title: 'Notifications',
      description: 'Stay updated with travel reminders and alerts',
      icon: Bell,
      color: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      status: 'Active',
      features: ['Trip Reminders', 'Booking Alerts', 'Weather Updates', 'Custom Notifications'],
      onClick: () => {
        navigate('/dashboard/notifications');
        toast({
          title: "Notifications",
          description: "Viewing your notifications...",
        });
      }
    },
    {
      title: 'Settings & Configuration',
      description: 'Customize your travel planning experience',
      icon: Settings,
      color: 'bg-gradient-to-r from-gray-500 to-gray-600',
      status: 'Active',
      features: ['App Preferences', 'Privacy Settings', 'Data Management', 'Export Options'],
      onClick: () => {
        navigate('/dashboard/settings');
        toast({
          title: "Settings",
          description: "Opening application settings...",
        });
      }
    }
  ];

  return (
    <TripProvider>
      <div className="min-h-full bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-travel-brown-600 to-travel-brown-700 text-white border-0">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">
                  Welcome Back, Explorer! 🌍
                </CardTitle>
                <CardDescription className="text-travel-brown-100">
                  Ready for your next adventure? Let's make it unforgettable.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    Premium Member
                  </Badge>
                  <div className="flex items-center text-travel-brown-100">
                    <CheckCircle size={16} className="mr-1" />
                    <span className="text-sm">All systems ready</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trip Statistics */}
          <div className="mb-8">
            <TripStats />
          </div>

          {/* Available Modules */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-travel-brown-800">
                  Available Modules
                </CardTitle>
                <CardDescription>
                  Access all your travel planning tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {moduleCards.map((module, index) => {
                    const Icon = module.icon;
                    return (
                      <Card
                        key={index}
                        className="cursor-pointer group hover:shadow-lg transition-all duration-300 border-travel-brown-200"
                        onClick={module.onClick}
                      >
                        <CardHeader className={`${module.color} text-white rounded-t-lg`}>
                          <div className="flex items-start justify-between">
                            <div className="p-3 bg-white/20 rounded-lg">
                              <Icon className="h-8 w-8" />
                            </div>
                            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                              {module.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <CardTitle className="text-lg mb-2 text-travel-brown-800">
                            {module.title}
                          </CardTitle>
                          <CardDescription className="mb-4">
                            {module.description}
                          </CardDescription>
                          <Separator className="my-3" />
                          <div className="space-y-2">
                            {module.features.slice(0, 3).map((feature, idx) => (
                              <div key={idx} className="flex items-center text-sm text-gray-600">
                                <div className="w-1.5 h-1.5 bg-travel-brown-500 rounded-full mr-2"></div>
                                {feature}
                              </div>
                            ))}
                            {module.features.length > 3 && (
                              <div className="text-sm text-gray-500">
                                +{module.features.length - 3} more features
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-travel-brown-800">
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Jump into your most common tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-auto p-6 flex flex-col items-center space-y-3 hover:bg-travel-brown-50 border-travel-brown-200"
                        onClick={action.onClick}
                      >
                        <div className={`p-3 rounded-lg ${action.color} text-white`}>
                          <Icon size={24} />
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-gray-900">{action.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{action.description}</p>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
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
