import React, { useState, useEffect } from 'react';
import { 
  IoCalendarOutline as CalendarDaysIcon,
  IoAdd as PlusIcon,
  IoChevronBack as ChevronLeftIcon,
  IoChevronForward as ChevronRightIcon,
  IoTimeOutline as ClockIcon,
  IoLocationOutline as MapPinIcon,
  IoCashOutline as CurrencyDollarIcon,
  IoCheckboxOutline as CheckCircleIcon,
  IoWarningOutline as ExclamationTriangleIcon,
  IoInformationCircleOutline as InformationCircleIcon,
  IoFunnelOutline as FunnelIcon,
  IoAppsOutline as Squares2X2Icon,
  IoListOutline as ListBulletIcon
} from 'react-icons/io5';
import { IoCheckbox as CheckCircleIconSolid } from 'react-icons/io5';
import itineraryApi from '../services/itineraryApi';
import ItineraryDayView from './ItineraryDayView';
import ItineraryForm from './ItineraryForm';
import ItinerarySummary from './ItinerarySummary';
import LoadingSpinner from './LoadingSpinner';

const ItineraryManager = ({ tripId, trip }) => {
  const [itinerary, setItinerary] = useState({});
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline', 'grid', 'list'
  const [filters, setFilters] = useState({
    category: 'all',
    completed: 'all',
    priority: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { value: 'all', label: 'All Categories', color: 'gray' },
    { value: 'sightseeing', label: 'Sightseeing', color: 'blue' },
    { value: 'food', label: 'Food & Dining', color: 'orange' },
    { value: 'transport', label: 'Transport', color: 'green' },
    { value: 'accommodation', label: 'Accommodation', color: 'purple' },
    { value: 'shopping', label: 'Shopping', color: 'pink' },
    { value: 'entertainment', label: 'Entertainment', color: 'indigo' },
    { value: 'other', label: 'Other', color: 'gray' }
  ];

  const priorities = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  useEffect(() => {
    if (tripId) {
      fetchItinerary();
      fetchSummary();
    }
  }, [tripId, filters]);

  const fetchItinerary = async () => {
    try {
      setLoading(true);
      const filterParams = {};
      if (filters.category !== 'all') filterParams.category = filters.category;
      if (filters.completed !== 'all') filterParams.completed = filters.completed === 'true';
      
      const response = await itineraryApi.getTripItinerary(tripId, filterParams);
      setItinerary(response.itinerary);
      setError(null);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching itinerary:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await itineraryApi.getTripItinerarySummary(tripId);
      setSummary(response.summary);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const handleCreateItem = async (itemData) => {
    try {
      await itineraryApi.createItinerary({ ...itemData, trip_id: tripId });
      await fetchItinerary();
      await fetchSummary();
      setShowForm(false);
    } catch (error) {
      console.error('Error creating itinerary item:', error);
      throw error;
    }
  };

  const handleUpdateItem = async (id, updateData) => {
    try {
      await itineraryApi.updateItinerary(id, updateData);
      await fetchItinerary();
      await fetchSummary();
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating itinerary item:', error);
      throw error;
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await itineraryApi.deleteItinerary(id);
        await fetchItinerary();
        await fetchSummary();
      } catch (error) {
        console.error('Error deleting itinerary item:', error);
      }
    }
  };

  const handleToggleCompletion = async (id) => {
    try {
      await itineraryApi.toggleCompletion(id);
      await fetchItinerary();
      await fetchSummary();
    } catch (error) {
      console.error('Error toggling completion:', error);
    }
  };

  const handleDragEnd = async (result) => {
    // For now, just log - we'll implement simple reordering later
    console.log('Reordering not yet implemented');
  };

  const getDaysArray = () => {
    if (!trip) return [];
    const days = [];
    for (let i = 1; i <= trip.duration_days; i++) {
      days.push(i);
    }
    return days;
  };

  const getTotalActivities = () => {
    return Object.values(itinerary).reduce((total, dayItems) => total + dayItems.length, 0);
  };

  const getCompletedActivities = () => {
    return Object.values(itinerary)
      .flat()
      .filter(item => item.is_completed).length;
  };

  const getDayProgress = (dayNumber) => {
    const dayItems = itinerary[dayNumber] || [];
    if (dayItems.length === 0) return 0;
    const completed = dayItems.filter(item => item.is_completed).length;
    return Math.round((completed / dayItems.length) * 100);
  };

  const getCategoryColor = (category) => {
    const categoryData = categories.find(cat => cat.value === category);
    return categoryData ? categoryData.color : 'gray';
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <InformationCircleIcon className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <InformationCircleIcon className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const filteredItinerary = () => {
    if (filters.priority === 'all') return itinerary;
    
    const filtered = {};
    Object.keys(itinerary).forEach(day => {
      const dayItems = itinerary[day].filter(item => item.priority === filters.priority);
      if (dayItems.length > 0) {
        filtered[day] = dayItems;
      }
    });
    return filtered;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <div className="flex">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading itinerary</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Trip Itinerary: {trip?.destination}
            </h1>
            <div className="flex items-center text-sm text-gray-600 space-x-4">
              <div className="flex items-center">
                <CalendarDaysIcon className="h-4 w-4 mr-1" />
                {trip?.duration_days} days
              </div>
              <div className="flex items-center">
                <ListBulletIcon className="h-4 w-4 mr-1" />
                {getTotalActivities()} activities
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                {getCompletedActivities()} completed
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            {/* View Mode Toggle */}
            <div className="flex rounded-lg border border-gray-300 p-1">
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'timeline'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Grid
              </button>
            </div>

            {/* Filters */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <FunnelIcon className="h-4 w-4 mr-1" />
              Filters
            </button>

            {/* Add Activity Button */}
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Activity
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.completed}
                  onChange={(e) => setFilters({ ...filters, completed: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="all">All Activities</option>
                  <option value="true">Completed</option>
                  <option value="false">Pending</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      {summary && (
        <ItinerarySummary 
          summary={summary}
          trip={trip}
          className="mb-6"
        />
      )}

      {/* Day Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSelectedDay(Math.max(1, selectedDay - 1))}
            disabled={selectedDay <= 1}
            className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeftIcon className="h-4 w-4 mr-1" />
            Previous Day
          </button>
          
          <div className="flex items-center space-x-2">
            {getDaysArray().map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedDay === day
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Day {day}
                {itinerary[day] && itinerary[day].length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">
                    {itinerary[day].length}
                  </span>
                )}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setSelectedDay(Math.min(trip?.duration_days || 1, selectedDay + 1))}
            disabled={selectedDay >= (trip?.duration_days || 1)}
            className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next Day
            <ChevronRightIcon className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        <div className="text-sm text-gray-600">
          Progress: {getDayProgress(selectedDay)}%
        </div>
      </div>

      {/* Itinerary Content */}
      <div className="space-y-6">
        {viewMode === 'timeline' ? (
          <ItineraryDayView
            day={selectedDay}
            items={filteredItinerary()[selectedDay] || []}
            onEdit={setEditingItem}
            onDelete={handleDeleteItem}
            onToggleCompletion={handleToggleCompletion}
            getCategoryColor={getCategoryColor}
            getPriorityIcon={getPriorityIcon}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getDaysArray().map(day => {
              const dayItems = filteredItinerary()[day] || [];
              if (dayItems.length === 0 && filters.category === 'all' && filters.completed === 'all' && filters.priority === 'all') {
                return null;
              }
              
              return (
                <div key={day} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Day {day}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{dayItems.length} activities</span>
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {dayItems.slice(0, 3).map(item => (
                      <div key={item.itinerary_id} className="flex items-start space-x-3 p-2 rounded-lg bg-gray-50">
                        <button
                          onClick={() => handleToggleCompletion(item.itinerary_id)}
                          className="flex-shrink-0 mt-0.5"
                        >
                          {item.is_completed ? (
                            <CheckCircleIconSolid className="h-5 w-5 text-green-600" />
                          ) : (
                            <CheckCircleIcon className="h-5 w-5 text-gray-400 hover:text-green-600 transition-colors" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${item.is_completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {item.activity}
                          </p>
                          {item.start_time && (
                            <p className="text-xs text-gray-500 mt-1 flex items-center">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              {item.start_time}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {dayItems.length > 3 && (
                      <button
                        onClick={() => setSelectedDay(day)}
                        className="w-full text-center text-sm text-blue-600 hover:text-blue-700 py-2"
                      >
                        View all {dayItems.length} activities
                      </button>
                    )}
                    
                    {dayItems.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No activities planned for this day
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Forms and Modals */}
      {showForm && (
        <ItineraryForm
          tripId={tripId}
          trip={trip}
          defaultDay={selectedDay}
          onSubmit={handleCreateItem}
          onClose={() => setShowForm(false)}
          categories={categories}
        />
      )}

      {editingItem && (
        <ItineraryForm
          tripId={tripId}
          trip={trip}
          item={editingItem}
          onSubmit={(data) => handleUpdateItem(editingItem.itinerary_id, data)}
          onClose={() => setEditingItem(null)}
          categories={categories}
          isEditing={true}
        />
      )}
    </div>
  );
};

export default ItineraryManager;
