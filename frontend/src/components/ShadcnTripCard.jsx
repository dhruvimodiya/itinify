import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Edit, 
  Trash2, 
  Eye, 
  Star, 
  Plane,
  Heart,
  Share2
} from 'lucide-react';
import { motion } from 'framer-motion';

const ShadcnTripCard = ({ trip = {
  id: 1,
  name: "Amazing Paris Adventure",
  destination: "Paris, France",
  start_date: "2024-12-15",
  end_date: "2024-12-22",
  budget: 2500,
  image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=250&fit=crop",
  rating: 4.8,
  status: "upcoming"
}, onEdit, onDelete, onView }) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const getStatusBadge = (status) => {
    const statusConfig = {
      upcoming: { variant: "default", color: "bg-blue-100 text-blue-800" },
      ongoing: { variant: "default", color: "bg-green-100 text-green-800" },
      completed: { variant: "secondary", color: "bg-gray-100 text-gray-800" }
    };
    
    return statusConfig[status] || statusConfig.upcoming;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
        {/* Trip Image Header */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={trip.image} 
            alt={trip.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-3 right-3 flex space-x-2">
            <Button
              size="sm"
              variant="secondary"
              className="w-8 h-8 p-0 bg-white/80 hover:bg-white backdrop-blur-sm"
              onClick={() => setIsFavorited(!isFavorited)}
            >
              <Heart 
                size={16} 
                className={isFavorited ? "text-red-500 fill-current" : "text-gray-600"} 
              />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="w-8 h-8 p-0 bg-white/80 hover:bg-white backdrop-blur-sm"
            >
              <Share2 size={16} className="text-gray-600" />
            </Button>
          </div>
          
          {/* Status Badge */}
          <div className="absolute bottom-3 left-3">
            <Badge className={getStatusBadge(trip.status).color}>
              {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
            </Badge>
          </div>
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-bold text-travel-brown-800 mb-1">
                {trip.name}
              </CardTitle>
              <CardDescription className="flex items-center text-gray-600">
                <MapPin size={14} className="mr-1 text-travel-brown-600" />
                {trip.destination}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-1 ml-2">
              <Star size={14} className="text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-gray-700">{trip.rating}</span>
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-4">
          <div className="space-y-3">
            {/* Trip Details */}
            <div className="flex items-center text-sm text-gray-600">
              <Calendar size={16} className="mr-2 text-travel-brown-600" />
              <span>{formatDate(trip.start_date)} - {formatDate(trip.end_date)}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <DollarSign size={16} className="mr-2 text-travel-brown-600" />
              <span className="font-medium">${trip.budget.toLocaleString()}</span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <Plane size={16} className="mr-2 text-travel-brown-600" />
              <span>7 days adventure</span>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-4">
              <Button 
                variant="default" 
                size="sm" 
                className="flex-1 bg-travel-brown-600 hover:bg-travel-brown-700"
                onClick={() => onView && onView(trip)}
              >
                <Eye size={16} className="mr-1" />
                View
              </Button>
              
              <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="border-travel-brown-300 hover:bg-travel-brown-50">
                    <Edit size={16} className="mr-1" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Edit Trip</DialogTitle>
                    <DialogDescription>
                      Update your trip details below.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Trip Name
                      </label>
                      <Input 
                        defaultValue={trip.name}
                        className="border-travel-brown-200 focus:border-travel-brown-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Destination
                      </label>
                      <Input 
                        defaultValue={trip.destination}
                        className="border-travel-brown-200 focus:border-travel-brown-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Budget
                      </label>
                      <Input 
                        type="number"
                        defaultValue={trip.budget}
                        className="border-travel-brown-200 focus:border-travel-brown-500"
                      />
                    </div>
                    <div className="flex space-x-2 pt-4">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setShowEditDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        className="flex-1 bg-travel-brown-600 hover:bg-travel-brown-700"
                        onClick={() => {
                          setShowEditDialog(false);
                          onEdit && onEdit(trip);
                        }}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => onDelete && onDelete(trip)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ShadcnTripCard;