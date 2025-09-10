import React from 'react';
import { 
  IoTimeOutline as ClockIcon,
  IoLocationOutline as MapPinIcon,
  IoCashOutline as CurrencyDollarIcon,
  IoCheckboxOutline as CheckCircleIcon,
  IoPencilOutline as PencilIcon,
  IoTrashOutline as TrashIcon,
  IoMenuOutline as Bars3Icon
} from 'react-icons/io5';
import { IoCheckbox as CheckCircleIconSolid } from 'react-icons/io5';

const ItineraryDayView = ({ 
  day, 
  items, 
  onEdit, 
  onDelete, 
  onToggleCompletion,
  getCategoryColor,
  getPriorityIcon 
}) => {
  const formatTime = (timeString) => {
    if (!timeString) return null;
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    } catch (error) {
      return timeString;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      sightseeing: '🏛️',
      food: '🍽️',
      transport: '🚗',
      accommodation: '🏨',
      shopping: '🛍️',
      entertainment: '🎭',
      other: '📝'
    };
    return icons[category] || icons.other;
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5" />
            </svg>
          </div>
          <h3 className="mt-2 text-lg font-semibold text-gray-900">No activities planned</h3>
          <p className="mt-1 text-gray-600">Get started by adding your first activity for Day {day}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Day {day} Itinerary</h2>
        <p className="text-sm text-gray-600 mt-1">{items.length} activities planned</p>
      </div>

      <div className="p-6 space-y-4">
        {items.map((item, index) => (
          <div
            key={item.itinerary_id}
            className={`bg-white border border-gray-200 rounded-lg p-4 transition-all duration-200 hover:shadow-md hover:border-gray-300 ${
              item.is_completed ? 'opacity-75 bg-gray-50' : ''
            }`}
          >
            <div className="flex items-start space-x-4">
              {/* Drag Handle - Visual only for now */}
              <div className="flex-shrink-0 mt-1 text-gray-400 cursor-move">
                <Bars3Icon className="h-5 w-5" />
              </div>

              {/* Completion Toggle */}
              <button
                onClick={() => onToggleCompletion(item.itinerary_id)}
                className="flex-shrink-0 mt-1"
              >
                {item.is_completed ? (
                  <CheckCircleIconSolid className="h-6 w-6 text-green-600" />
                ) : (
                  <CheckCircleIcon className="h-6 w-6 text-gray-400 hover:text-green-600 transition-colors" />
                )}
              </button>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {/* Activity Title */}
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-lg">
                                {getCategoryIcon(item.category)}
                              </span>
                              <h3 className={`text-lg font-semibold ${
                                item.is_completed 
                                  ? 'line-through text-gray-500' 
                                  : 'text-gray-900'
                              }`}>
                                {item.activity}
                              </h3>
                              {getPriorityIcon(item.priority)}
                            </div>

                            {/* Description */}
                            {item.description && (
                              <p className="text-gray-600 mb-3 leading-relaxed">
                                {item.description}
                              </p>
                            )}

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                              {/* Time */}
                              {(item.start_time || item.end_time) && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                                  <span>
                                    {item.start_time && formatTime(item.start_time)}
                                    {item.start_time && item.end_time && ' - '}
                                    {item.end_time && formatTime(item.end_time)}
                                  </span>
                                </div>
                              )}

                              {/* Location */}
                              {item.location && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                                  <span className="truncate">{item.location}</span>
                                </div>
                              )}

                              {/* Cost */}
                              {item.cost > 0 && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <CurrencyDollarIcon className="h-4 w-4 mr-2 text-gray-400" />
                                  <span>{formatCurrency(item.cost)}</span>
                                </div>
                              )}
                            </div>

                            {/* Category Badge */}
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getCategoryColor(item.category)}-100 text-${getCategoryColor(item.category)}-800`}>
                                {item.category}
                              </span>
                              
                              {item.priority !== 'medium' && (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  item.priority === 'high' 
                                    ? 'bg-red-100 text-red-800' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {item.priority} priority
                                </span>
                              )}
                            </div>

                            {/* Notes */}
                            {item.notes && (
                              <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                <p className="text-sm text-yellow-800">
                                  <span className="font-medium">Note:</span> {item.notes}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => onEdit(item)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit activity"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => onDelete(item.itinerary_id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete activity"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        };

        export default ItineraryDayView;
