import React from 'react';
import { 
  IoTimeOutline as ClockIcon,
  IoLocationOutline as MapPinIcon,
  IoCashOutline as CurrencyDollarIcon,
  IoCheckboxOutline as CheckCircleIcon,
  IoPencilOutline as PencilIcon,
  IoTrashOutline as TrashIcon
} from 'react-icons/io5';
import { IoCheckbox as CheckCircleIconSolid } from 'react-icons/io5';

const ItineraryDayView = ({ 
  day, 
  items, 
  onEdit, 
  onDelete, 
  onToggleCompletion,
  getCategoryColor,
  getPriorityIcon,
  tripBudget = 0,
  totalTripExpenses = 0,
  showBudgetWarning = true
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
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate day expenses
  const dayExpenses = items.reduce((total, item) => total + (item.cost || 0), 0);
  
  // Calculate budget status
  const remainingBudget = tripBudget - totalTripExpenses;
  const isOverBudget = totalTripExpenses > tripBudget;
  const budgetUsagePercentage = tripBudget > 0 ? (totalTripExpenses / tripBudget) * 100 : 0;
  
  // Determine if this day's expenses push over budget
  const willExceedBudget = (totalTripExpenses - dayExpenses + dayExpenses) > tripBudget;
  const isHighExpenseDay = dayExpenses > (tripBudget * 0.2); // More than 20% of total budget in one day

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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Clean Header */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Day {day}</h2>
            <p className="text-sm text-gray-500">{items.length} activities</p>
          </div>
          
          {/* Simple Day Total */}
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900">{formatCurrency(dayExpenses)}</div>
            <div className="text-xs text-gray-500">today's cost</div>
          </div>
        </div>
        
        {/* Clean Budget Bar */}
        {showBudgetWarning && tripBudget > 0 && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Trip Budget</span>
              <span className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-gray-700'}`}>
                {formatCurrency(totalTripExpenses)} / {formatCurrency(tripBudget)}
              </span>
            </div>
            <div className=" bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  isOverBudget ? 'bg-red-500' : budgetUsagePercentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(budgetUsagePercentage, 100)}%` }}
              />
            </div>
            {isOverBudget && (
              <p className="text-xs text-red-600 mt-1">Over budget by {formatCurrency(totalTripExpenses - tripBudget)}</p>
            )}
          </div>
        )}
      </div>

      {/* Clean Activity List */}
      <div className="p-4 space-y-3">
        {items.map((item, index) => (
          <div
            key={item.itinerary_id}
            className={`border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow ${
              item.is_completed ? 'bg-gray-50 opacity-80' : 'bg-white'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Completion Checkbox */}
              <button
                onClick={() => onToggleCompletion(item.itinerary_id)}
                className="flex-shrink-0 mt-1"
              >
                {item.is_completed ? (
                  <CheckCircleIconSolid className="h-5 w-5 text-green-600" />
                ) : (
                  <CheckCircleIcon className="h-5 w-5 text-gray-400 hover:text-green-600 transition-colors" />
                )}
              </button>

              {/* Activity Content */}
              <div className="flex-1 min-w-0">
                {/* Title Row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{getCategoryIcon(item.category)}</span>
                    <h3 className={`text-base font-medium ${
                      item.is_completed ? 'line-through text-gray-500' : 'text-gray-900'
                    }`}>
                      {item.activity}
                    </h3>
                  </div>
                  
                  {/* Cost */}
                  {item.cost > 0 && (
                    <span className={`text-sm font-medium px-2 py-1 rounded ${
                      item.cost > (tripBudget * 0.1) 
                        ? 'bg-red-100 text-red-700' 
                        : item.cost > (tripBudget * 0.05)
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                    }`}>
                      {formatCurrency(item.cost)}
                    </span>
                  )}
                </div>

                {/* Details Row */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  {/* Time */}
                  {(item.start_time || item.end_time) && (
                    <div className="flex items-center gap-1">
                      <ClockIcon className="h-4 w-4" />
                      <span>
                        {item.start_time && formatTime(item.start_time)}
                        {item.start_time && item.end_time && ' - '}
                        {item.end_time && formatTime(item.end_time)}
                      </span>
                    </div>
                  )}

                  {/* Location */}
                  {item.location && (
                    <div className="flex items-center gap-1">
                      <MapPinIcon className="h-4 w-4" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  )}

                  {/* Category */}
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {item.category}
                  </span>
                </div>

                {/* Description */}
                {item.description && (
                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                )}

                {/* Notes */}
                {item.notes && (
                  <div className="text-xs bg-yellow-50 text-yellow-800 p-2 rounded border border-yellow-200">
                    <strong>Note:</strong> {item.notes}
                  </div>
                )}

                {/* High Cost Warning */}
                {item.cost > 0 && showBudgetWarning && tripBudget > 0 && item.cost > (tripBudget * 0.1) && (
                  <div className="text-xs bg-red-50 text-red-700 p-2 rounded border border-red-200 mt-2">
                    High cost item - {((item.cost / tripBudget) * 100).toFixed(0)}% of budget
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-1">
                <button
                  onClick={() => onEdit(item)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Edit"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(item.itinerary_id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Delete"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
            </div>
          );
        };

        export default ItineraryDayView;
