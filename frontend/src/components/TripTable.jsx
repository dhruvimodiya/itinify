import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  Clock, 
  Edit, 
  Eye,
  Trash2,
  MoreVertical,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const TripTable = ({ trips, onEdit, onDelete, onView }) => {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [expandedRow, setExpandedRow] = useState(null);

  // Calculate trip status
  const getTripStatus = (trip) => {
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
    if (!amount) return '-';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate duration
  const getDuration = (trip) => {
    if (trip.duration_days) {
      return trip.duration_days === 1 ? '1 day' : `${trip.duration_days} days`;
    }
    
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1 ? '1 day' : `${diffDays} days`;
  };

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sort trips
  const sortedTrips = React.useMemo(() => {
    if (!sortConfig.key) return trips;

    return [...trips].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle date sorting
      if (sortConfig.key === 'start_date' || sortConfig.key === 'end_date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      // Handle numeric sorting
      if (sortConfig.key === 'total_budget') {
        aValue = aValue || 0;
        bValue = bValue || 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [trips, sortConfig]);

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

  const SortButton = ({ children, sortKey }) => (
    <button
      onClick={() => handleSort(sortKey)}
      className="flex items-center space-x-1 text-left hover:text-gray-900 transition-colors"
    >
      <span>{children}</span>
      {sortConfig.key === sortKey && (
        sortConfig.direction === 'asc' ? 
          <ChevronUp className="w-4 h-4" /> : 
          <ChevronDown className="w-4 h-4" />
      )}
    </button>
  );

  if (!trips || trips.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-8 text-center">
          <p className="text-gray-500">No trips found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton sortKey="destination">Destination</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton sortKey="start_date">Dates</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton sortKey="total_budget">Budget</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedTrips.map((trip) => {
              const status = getTripStatus(trip);
              return (
                <React.Fragment key={trip.trip_id}>
                  <tr 
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setExpandedRow(expandedRow === trip.trip_id ? null : trip.trip_id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{trip.destination}</div>
                        {trip.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {trip.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getDuration(trip)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(trip.total_budget)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusConfig[status].color}`}>
                        {statusConfig[status].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onView?.(trip);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="View Trip"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/dashboard/itinerary/${trip.trip_id}`);
                          }}
                          className="text-green-600 hover:text-green-900 p-1 rounded"
                          title="View Itinerary"
                        >
                          <Calendar className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit?.(trip);
                          }}
                          className="text-gray-600 hover:text-gray-900 p-1 rounded"
                          title="Edit Trip"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(trip);
                          }}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Delete Trip"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded row for additional details */}
                  {expandedRow === trip.trip_id && (
                    <tr className="bg-gray-50">
                      <td colSpan="6" className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Trip ID:</span>
                            <span className="ml-2 text-gray-600">{trip.trip_id}</span>
                          </div>
                          {trip.created_at && (
                            <div>
                              <span className="font-medium text-gray-700">Created:</span>
                              <span className="ml-2 text-gray-600">{formatDate(trip.created_at)}</span>
                            </div>
                          )}
                          {trip.total_budget && (
                            <div>
                              <span className="font-medium text-gray-700">Budget:</span>
                              <span className="ml-2 text-gray-600">{formatCurrency(trip.total_budget)}</span>
                            </div>
                          )}
                          <div>
                            <span className="font-medium text-gray-700">Status:</span>
                            <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${statusConfig[status].color}`}>
                              {statusConfig[status].label}
                            </span>
                          </div>
                        </div>
                        {trip.description && (
                          <div className="mt-3">
                            <span className="font-medium text-gray-700">Description:</span>
                            <p className="mt-1 text-gray-600">{trip.description}</p>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TripTable;