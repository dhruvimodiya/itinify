import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  Clock, 
  Edit, 
  Eye,
  Trash2,
  MoreVertical
} from 'lucide-react';

const SimpleTripCard = ({ trip, onEdit, onDelete, onView }) => {
  const navigate = useNavigate();

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
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate duration
  const getDuration = () => {
    if (trip.duration_days) {
      return trip.duration_days === 1 ? '1 day' : `${trip.duration_days} days`;
    }
    
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1 ? '1 day' : `${diffDays} days`;
  };

  const status = getTripStatus();
  
  const statusConfig = {
    upcoming: {
      color: 'bg-blue-100 text-blue-800',
      label: 'Upcoming'
    },
    ongoing: {
      color: 'bg-green-100 text-green-800',
      label: 'Ongoing'
    },
    completed: {
      color: 'bg-gray-100 text-gray-800',
      label: 'Completed'
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900">{trip.destination}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig[status].color}`}>
                {statusConfig[status].label}
              </span>
            </div>
            <p className="text-sm text-gray-600">{trip.description || 'No description available'}</p>
          </div>
          <div className="ml-4">
            <button
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // Add dropdown menu functionality here
              }}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Date */}
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            <span>{formatDate(trip.start_date)} - {formatDate(trip.end_date)}</span>
          </div>
          
          {/* Duration */}
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2 text-gray-400" />
            <span>{getDuration()}</span>
          </div>
          
          {/* Location */}
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            <span>{trip.destination}</span>
          </div>
          
          {/* Budget */}
          {trip.total_budget && (
            <div className="flex items-center text-sm text-gray-600">
              <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
              <span>{formatCurrency(trip.total_budget)}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView?.(trip);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            View
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/dashboard/itinerary/${trip.trip_id}`);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Itinerary
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(trip);
            }}
            className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(trip);
            }}
            className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleTripCard;