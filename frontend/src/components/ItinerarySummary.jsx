import React from 'react';
import {
  IoCalendarOutline as CalendarDaysIcon,
  IoListOutline as ListBulletIcon,
  IoCheckboxOutline as CheckCircleIcon,
  IoCashOutline as CurrencyDollarIcon,
  IoBarChartOutline as ChartBarIcon,
  IoTimeOutline as ClockIcon,
  IoAppsOutline as Squares2X2Icon
} from 'react-icons/io5';

const ItinerarySummary = ({ summary, trip, className = '' }) => {
  if (!summary) {
    return null;
  }

  const { daily_breakdown, overall_stats, category_breakdown } = summary;

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

  const getCategoryColor = (category) => {
    const colors = {
      sightseeing: 'blue',
      food: 'orange',
      transport: 'green',
      accommodation: 'purple',
      shopping: 'pink',
      entertainment: 'indigo',
      other: 'gray'
    };
    return colors[category] || 'gray';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ListBulletIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Activities</p>
              <p className="text-2xl font-bold text-gray-900">{overall_stats.total_activities}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{overall_stats.completed_activities}</p>
              <p className="text-xs text-gray-500">
                {overall_stats.completion_percentage}% complete
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(overall_stats.total_cost)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarDaysIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Trip Duration</p>
              <p className="text-2xl font-bold text-gray-900">{trip?.duration_days}</p>
              <p className="text-xs text-gray-500">days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
          <span className="text-sm font-medium text-gray-600">
            {overall_stats.completion_percentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${overall_stats.completion_percentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {overall_stats.completed_activities} of {overall_stats.total_activities} activities completed
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Daily Breakdown
          </h3>
          <div className="space-y-4">
            {daily_breakdown.map((day) => (
              <div key={day.day_number} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Day {day.day_number}</h4>
                    <span className="text-sm text-gray-600">
                      {day.activities_count} activities
                    </span>
                  </div>
                  
                  {/* Progress bar for each day */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${day.completion_percentage || 0}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{day.completed_count}/{day.activities_count} completed</span>
                    <span>{formatCurrency(day.total_cost)}</span>
                  </div>
                </div>
              </div>
            ))}

            {daily_breakdown.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <CalendarDaysIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No activities planned yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Squares2X2Icon className="h-5 w-5 mr-2" />
            Category Breakdown
          </h3>
          <div className="space-y-3">
            {category_breakdown.map((category) => (
              <div 
                key={category._id} 
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getCategoryIcon(category._id)}</span>
                  <div>
                    <p className="font-medium text-gray-900 capitalize">
                      {category._id}
                    </p>
                    <p className="text-sm text-gray-600">
                      {category.completed}/{category.count} completed
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {formatCurrency(category.total_cost)}
                  </p>
                  <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className={`bg-${getCategoryColor(category._id)}-600 h-2 rounded-full`}
                      style={{ 
                        width: `${category.count > 0 ? (category.completed / category.count) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}

            {category_breakdown.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <ChartBarIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No categories to display</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-sm p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Trip Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">
              {overall_stats.total_activities > 0 
                ? Math.round(overall_stats.total_activities / (trip?.duration_days || 1) * 10) / 10
                : 0
              }
            </div>
            <div className="text-sm opacity-90">Activities per day</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold">
              {overall_stats.total_cost > 0 
                ? formatCurrency(overall_stats.total_cost / (trip?.duration_days || 1))
                : '$0.00'
              }
            </div>
            <div className="text-sm opacity-90">Average daily cost</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold">
              {overall_stats.total_activities - overall_stats.completed_activities}
            </div>
            <div className="text-sm opacity-90">Activities remaining</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItinerarySummary;
