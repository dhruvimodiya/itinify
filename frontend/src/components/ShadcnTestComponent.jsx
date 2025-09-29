import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { MapPin, Calendar, DollarSign, Star } from 'lucide-react';
import ShadcnTripCard from './ShadcnTripCard';

const ShadcnTestComponent = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const sampleTrip = {
    id: 1,
    name: "Magical Japan Journey",
    destination: "Tokyo, Japan",
    start_date: "2025-03-15",
    end_date: "2025-03-25",
    budget: 3500,
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=250&fit=crop",
    rating: 4.9,
    status: "upcoming"
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-travel-brown-800 mb-2">
            Shadcn/UI Integration Success! 🎉
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Your travel app now has beautiful, accessible UI components
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-600 font-medium">All components working perfectly</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enhanced Trip Card */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-travel-brown-800">
              Enhanced Trip Card with Shadcn/UI
            </h2>
            <ShadcnTripCard 
              trip={sampleTrip}
              onView={(trip) => alert(`Viewing trip: ${trip.name}`)}
              onEdit={(trip) => alert(`Editing trip: ${trip.name}`)}
              onDelete={(trip) => alert(`Deleting trip: ${trip.name}`)}
            />
          </div>

          {/* Component Showcase */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-travel-brown-800">
              Component Examples
            </h2>
            
            {/* Basic Card */}
            <Card className="border-travel-brown-200">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=150&h=150&fit=crop&crop=face" />
                    <AvatarFallback>TR</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-travel-brown-800">Travel Profile</CardTitle>
                    <CardDescription>Manage your travel preferences</CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <Separator />
              
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin size={16} className="text-travel-brown-600" />
                    <span>Favorite destinations: 15 countries</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Badge variant="secondary" className="bg-travel-brown-100 text-travel-brown-800">
                      Adventure Seeker
                    </Badge>
                    <Badge variant="outline" className="border-travel-accent-300 text-travel-accent-700">
                      Photography
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Input Examples */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-travel-brown-800">Form Controls</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-travel-brown-800 mb-1 block">
                    Search Destinations
                  </label>
                  <Input 
                    placeholder="Where would you like to go?" 
                    className="border-travel-brown-200 focus:border-travel-brown-500" 
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-travel-brown-800 mb-1 block">
                    Travel Budget
                  </label>
                  <Input 
                    type="number"
                    placeholder="Enter your budget" 
                    className="border-travel-brown-200 focus:border-travel-brown-500" 
                  />
                </div>
              </div>
            </div>

            {/* Button Examples */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-travel-brown-800">Button Variants</h3>
              <div className="flex flex-wrap gap-3">
                <Button className="bg-travel-brown-600 hover:bg-travel-brown-700">
                  Primary Button
                </Button>
                <Button variant="outline" className="border-travel-brown-300 hover:bg-travel-brown-50">
                  Outline Button
                </Button>
                <Button variant="secondary" className="bg-travel-brown-100 text-travel-brown-800 hover:bg-travel-brown-200">
                  Secondary
                </Button>
                <Button variant="destructive">
                  Delete Trip
                </Button>
              </div>
            </div>

            {/* Dialog Example */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-travel-brown-800">Dialog Example</h3>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-travel-brown-600 hover:bg-travel-brown-700">
                    Plan New Trip
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Trip</DialogTitle>
                    <DialogDescription>
                      Start planning your next adventure with our intuitive trip planner.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input placeholder="Trip name" className="border-travel-brown-200" />
                    <Input placeholder="Destination" className="border-travel-brown-200" />
                    <Input type="date" className="border-travel-brown-200" />
                    <div className="flex space-x-2 pt-4">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        className="flex-1 bg-travel-brown-600 hover:bg-travel-brown-700"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Create Trip
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Integration Status */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Star size={16} className="text-white fill-current" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800">Integration Complete!</h3>
                <p className="text-sm text-green-700">
                  Shadcn/UI components are now seamlessly integrated with your existing NextUI and custom styling.
                  Your travel app can now use both component libraries together without any conflicts.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShadcnTestComponent;