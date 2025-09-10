import React, { useState, useEffect } from 'react';
import { 
  IoClose as XMarkIcon,
  IoTimeOutline as ClockIcon,
  IoLocationOutline as MapPinIcon,
  IoCashOutline as CurrencyDollarIcon,
  IoDocumentTextOutline as DocumentTextIcon,
  IoWarningOutline as ExclamationTriangleIcon,
  IoInformationCircleOutline as InformationCircleIcon
} from 'react-icons/io5';

const ItineraryForm = ({ 
  tripId, 
  trip, 
  item = null, 
  defaultDay = 1, 
  onSubmit, 
  onClose, 
  categories = [],
  isEditing = false 
}) => {
  const [formData, setFormData] = useState({
    day_number: defaultDay,
    activity: '',
    description: '',
    location: '',
    start_time: '',
    end_time: '',
    cost: '',
    priority: 'medium',
    category: 'other',
    notes: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        day_number: item.day_number,
        activity: item.activity || '',
        description: item.description || '',
        location: item.location || '',
        start_time: item.start_time || '',
        end_time: item.end_time || '',
        cost: item.cost || '',
        priority: item.priority || 'medium',
        category: item.category || 'other',
        notes: item.notes || ''
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.activity.trim()) {
      newErrors.activity = 'Activity name is required';
    }

    if (!formData.day_number || formData.day_number < 1) {
      newErrors.day_number = 'Please select a valid day';
    }

    if (trip && formData.day_number > trip.duration_days) {
      newErrors.day_number = `Day must be between 1 and ${trip.duration_days}`;
    }

    if (formData.cost && (isNaN(formData.cost) || parseFloat(formData.cost) < 0)) {
      newErrors.cost = 'Cost must be a valid positive number';
    }

    // Time validation
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (formData.start_time && !timeRegex.test(formData.start_time)) {
      newErrors.start_time = 'Start time must be in HH:MM format (24-hour)';
    }

    if (formData.end_time && !timeRegex.test(formData.end_time)) {
      newErrors.end_time = 'End time must be in HH:MM format (24-hour)';
    }

    // Check if end time is after start time (same day)
    if (formData.start_time && formData.end_time) {
      const [startHour, startMin] = formData.start_time.split(':').map(Number);
      const [endHour, endMin] = formData.end_time.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      
      if (endMinutes <= startMinutes) {
        newErrors.end_time = 'End time must be after start time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        day_number: parseInt(formData.day_number),
        cost: formData.cost ? parseFloat(formData.cost) : 0,
        activity: formData.activity.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        notes: formData.notes.trim()
      };

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const getDaysArray = () => {
    if (!trip) return [1];
    const days = [];
    for (let i = 1; i <= trip.duration_days; i++) {
      days.push(i);
    }
    return days;
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-2xl p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl sm:my-16">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {isEditing ? 'Edit Activity' : 'Add New Activity'}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {trip?.destination} • Day {formData.day_number}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Day Selection & Activity Name */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Day <span className="text-red-500">*</span>
                </label>
                <select
                  name="day_number"
                  value={formData.day_number}
                  onChange={handleChange}
                  className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    errors.day_number ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                >
                  {getDaysArray().map(day => (
                    <option key={day} value={day}>Day {day}</option>
                  ))}
                </select>
                {errors.day_number && (
                  <p className="mt-1 text-sm text-red-600">{errors.day_number}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="activity"
                  value={formData.activity}
                  onChange={handleChange}
                  placeholder="e.g., Visit Eiffel Tower"
                  className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    errors.activity ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                />
                {errors.activity && (
                  <p className="mt-1 text-sm text-red-600">{errors.activity}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DocumentTextIcon className="h-4 w-4 inline mr-1" />
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Add details about this activity..."
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPinIcon className="h-4 w-4 inline mr-1" />
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Champ de Mars, Paris"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Time & Cost */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <ClockIcon className="h-4 w-4 inline mr-1" />
                  Start Time
                </label>
                <input
                  type="time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    errors.start_time ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                />
                {errors.start_time && (
                  <p className="mt-1 text-sm text-red-600">{errors.start_time}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <ClockIcon className="h-4 w-4 inline mr-1" />
                  End Time
                </label>
                <input
                  type="time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                  className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    errors.end_time ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                />
                {errors.end_time && (
                  <p className="mt-1 text-sm text-red-600">{errors.end_time}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CurrencyDollarIcon className="h-4 w-4 inline mr-1" />
                  Cost (USD)
                </label>
                <input
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    errors.cost ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                />
                {errors.cost && (
                  <p className="mt-1 text-sm text-red-600">{errors.cost}</p>
                )}
              </div>
            </div>

            {/* Category & Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {categories.filter(cat => cat.value !== 'all').map(category => (
                    <option key={category.value} value={category.value}>
                      {getCategoryIcon(category.value)} {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="low">
                    Low Priority
                  </option>
                  <option value="medium">
                    Medium Priority
                  </option>
                  <option value="high">
                    High Priority
                  </option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Any additional notes or reminders..."
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="rounded-lg bg-red-50 p-4">
                <div className="flex">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{errors.submit}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEditing ? 'Update Activity' : 'Create Activity'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ItineraryForm;
