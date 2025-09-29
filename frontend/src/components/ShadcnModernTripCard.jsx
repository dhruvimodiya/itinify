import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  Clock, 
  Edit, 
  Trash2, 
  MoreVertical,
  Eye,
  Star,
  Heart,
  Share2,
  Sun,
  Plane,
  Camera
} from 'lucide-react';

const ModernTripCard = ({ trip, onEdit, onDelete, onView, showActions = true }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // Calculate trip status
  const getTripStatus = () => {
    const today = new Date();
    const startDate = new Date(trip.start_date);
    const endDate = new Date(trip.end_date);
    
    if (startDate > today) return 'upcoming';
    if (startDate <= today && endDate >= today) return 'ongoing';
    return 'completed';
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const status = getTripStatus();
  
  const getStatusBadge = (status) => {
    const statusConfig = {
      upcoming: { variant: "default", color: "bg-blue-500 hover:bg-blue-600", icon: Sun },
      ongoing: { variant: "default", color: "bg-green-500 hover:bg-green-600", icon: Plane },
      completed: { variant: "secondary", color: "bg-gray-500 hover:bg-gray-600", icon: Camera }
    };
    
    return statusConfig[status] || statusConfig.upcoming;
  };

  const statusInfo = getStatusBadge(status);
  const StatusIcon = statusInfo.icon;

  const getDestinationImage = (destination) => {
    const images = {
      'Paris': 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop',
      'Tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
      'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop',
      'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop',
      'Bali': 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop',
      'Sydney': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
    };
    
    const cityName = destination?.split(',')[0] || 'Default';
    return images[cityName] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop';
  };

  const calculateProgress = () => {
    if (status !== 'ongoing') return 0;
    const today = new Date();
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    const total = end - start;
    const elapsed = today - start;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  const getDaysUntilStart = () => {
    if (status !== 'upcoming') return 0;
    const today = new Date();
    const startDate = new Date(trip.start_date);
    const diffTime = startDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="h-full"
    >
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 border-0 shadow-md bg-gradient-to-br from-white to-gray-50">
        {/* Trip Image Header */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={getDestinationImage(trip.destination)} 
            alt={trip.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          <div className="absolute top-3 right-3 flex space-x-2">
            <Button
              size="sm"
              variant="secondary"
              className="w-8 h-8 p-0 bg-white/80 hover:bg-white backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsFavorited(!isFavorited);
              }}
            >
              <Heart 
                size={16} 
                className={isFavorited ? "text-red-500 fill-current" : "text-gray-600"} 
              />
            </Button>
            
            {showActions && (
              <Button
                size="sm"
                variant="secondary"
                className="w-8 h-8 p-0 bg-white/80 hover:bg-white backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
              >
                <MoreVertical size={16} className="text-gray-600" />
              </Button>
            )}
          </div>
          
          {/* Status Badge */}
          <div className="absolute bottom-3 left-3">
            <Badge className={`${statusInfo.color} text-white`}>
              <StatusIcon size={14} className="mr-1" />
              {status.charAt(0).toUpperCase() + status.slice(1)}
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
              <span className="text-sm font-medium text-gray-700">4.8</span>
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-4">
          <div className="space-y-4">
            {/* Trip Details */}
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar size={16} className="mr-2 text-travel-brown-600" />
                <span>{formatDate(trip.start_date)} - {formatDate(trip.end_date)}</span>
              </div>
              
              {trip.budget && (
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign size={16} className="mr-2 text-travel-brown-600" />
                  <span className="font-medium">${trip.budget.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Progress Bar for Ongoing Trips */}
            {status === 'ongoing' && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Trip Progress</span>
                  <span>{calculateProgress().toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-travel-brown-500 to-travel-brown-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${calculateProgress()}%` }}
                  />
                </div>
              </div>
            )}

            {/* Countdown for Upcoming Trips */}
            {status === 'upcoming' && (
              <div className="text-center">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Clock className="w-3 h-3 mr-1" />
                  {getDaysUntilStart()} days to go
                </Badge>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-2">
              <Button 
                variant="default" 
                size="sm" 
                className="flex-1 bg-travel-brown-600 hover:bg-travel-brown-700"
                onClick={() => onView && onView(trip)}
              >
                <Eye size={16} className="mr-1" />
                View
              </Button>
              
              {showActions && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-travel-brown-300 hover:bg-travel-brown-50"
                  onClick={() => onEdit && onEdit(trip)}
                >
                  <Edit size={16} className="mr-1" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </CardContent>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-16 right-3 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
            >
              <Button
                onClick={(e) => { 
                  e.stopPropagation();
                  onView && onView(trip); 
                  setShowMenu(false); 
                }}
                variant="ghost"
                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 justify-start h-auto"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
              
              {showActions && (
                <>
                  <Button
                    onClick={(e) => { 
                      e.stopPropagation();
                      onEdit && onEdit(trip); 
                      setShowMenu(false); 
                    }}
                    variant="ghost"
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 justify-start h-auto"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Trip
                  </Button>
                  
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                    }}
                    variant="ghost"
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 justify-start h-auto"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Trip
                  </Button>
                  
                  <Separator className="my-1" />
                  
                  <Button
                    onClick={(e) => { 
                      e.stopPropagation();
                      onDelete && onDelete(trip); 
                      setShowMenu(false); 
                    }}
                    variant="ghost"
                    className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 justify-start h-auto"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Trip
                  </Button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default ModernTripCard;