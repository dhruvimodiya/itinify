const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
  trip_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
    index: true
  },
  day_number: {
    type: Number,
    required: true,
    min: 1,
    validate: {
      validator: Number.isInteger,
      message: 'Day number must be an integer'
    }
  },
  activity: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000,
    default: ''
  },
  location: {
    type: String,
    trim: true,
    maxlength: 255,
    default: ''
  },
  start_time: {
    type: String,
    default: null,
    validate: {
      validator: function(value) {
        if (!value) return true;
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
      },
      message: 'Start time must be in HH:MM format (24-hour)'
    }
  },
  end_time: {
    type: String,
    default: null,
    validate: {
      validator: function(value) {
        if (!value) return true;
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
      },
      message: 'End time must be in HH:MM format (24-hour)'
    }
  },
  cost: {
    type: Number,
    min: 0,
    default: 0,
    validate: {
      validator: function(value) {
        return value >= 0;
      },
      message: 'Cost must be a positive number'
    }
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['sightseeing', 'food', 'transport', 'accommodation', 'shopping', 'entertainment', 'other'],
    default: 'other'
  },
  is_completed: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 1000,
    default: ''
  },
  order_index: {
    type: Number,
    default: 0
  }
}, {
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  },
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      ret.itinerary_id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Virtual for formatted time range
itinerarySchema.virtual('time_range').get(function() {
  if (this.start_time && this.end_time) {
    return `${this.start_time} - ${this.end_time}`;
  } else if (this.start_time) {
    return `From ${this.start_time}`;
  } else if (this.end_time) {
    return `Until ${this.end_time}`;
  }
  return null;
});

// Virtual for duration in minutes
itinerarySchema.virtual('duration_minutes').get(function() {
  if (this.start_time && this.end_time) {
    const [startHour, startMin] = this.start_time.split(':').map(Number);
    const [endHour, endMin] = this.end_time.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    return endMinutes >= startMinutes ? endMinutes - startMinutes : (24 * 60 - startMinutes + endMinutes);
  }
  return null;
});

// Indexes for efficient queries
itinerarySchema.index({ trip_id: 1, day_number: 1, order_index: 1 });
itinerarySchema.index({ trip_id: 1, category: 1 });
itinerarySchema.index({ trip_id: 1, is_completed: 1 });

// Pre-save middleware to validate time range
itinerarySchema.pre('save', function(next) {
  if (this.start_time && this.end_time) {
    const [startHour, startMin] = this.start_time.split(':').map(Number);
    const [endHour, endMin] = this.end_time.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    // Allow overnight activities
    if (endMinutes < startMinutes && endMinutes !== 0) {
      // Only warn, don't fail - overnight activities are valid
    }
  }
  next();
});

// Static methods
itinerarySchema.statics.findByTrip = function(tripId) {
  return this.find({ trip_id: tripId })
    .sort({ day_number: 1, order_index: 1, start_time: 1 });
};

itinerarySchema.statics.findByTripAndDay = function(tripId, dayNumber) {
  return this.find({ trip_id: tripId, day_number: dayNumber })
    .sort({ order_index: 1, start_time: 1 });
};

itinerarySchema.statics.findByCategory = function(tripId, category) {
  return this.find({ trip_id: tripId, category: category })
    .sort({ day_number: 1, order_index: 1 });
};

itinerarySchema.statics.getTripSummary = function(tripId) {
  return this.aggregate([
    { $match: { trip_id: new mongoose.Types.ObjectId(tripId) } },
    {
      $group: {
        _id: '$day_number',
        activities_count: { $sum: 1 },
        total_cost: { $sum: '$cost' },
        completed_count: { 
          $sum: { $cond: [{ $eq: ['$is_completed', true] }, 1, 0] } 
        },
        activities: { $push: '$$ROOT' }
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        day_number: '$_id',
        activities_count: 1,
        total_cost: 1,
        completed_count: 1,
        completion_percentage: {
          $multiply: [
            { $divide: ['$completed_count', '$activities_count'] },
            100
          ]
        },
        activities: {
          $sortArray: {
            input: '$activities',
            sortBy: { order_index: 1, start_time: 1 }
          }
        },
        _id: 0
      }
    }
  ]);
};

// Instance methods
itinerarySchema.methods.markAsCompleted = function() {
  this.is_completed = true;
  return this.save();
};

itinerarySchema.methods.markAsIncomplete = function() {
  this.is_completed = false;
  return this.save();
};

const Itinerary = mongoose.model('Itinerary', itinerarySchema);

module.exports = Itinerary;
