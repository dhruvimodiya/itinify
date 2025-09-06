const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  destination: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255
  },
  start_date: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return value >= new Date().setHours(0, 0, 0, 0);
      },
      message: 'Start date cannot be in the past'
    }
  },
  end_date: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return value >= this.start_date;
      },
      message: 'End date must be after or equal to start date'
    }
  },
  total_budget: {
    type: Number,
    min: 0,
    default: null,
    validate: {
      validator: function(value) {
        return value === null || value >= 0;
      },
      message: 'Budget must be a positive number'
    }
  }
}, {
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  },
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      ret.trip_id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Virtual for trip duration in days
tripSchema.virtual('duration_days').get(function() {
  if (this.start_date && this.end_date) {
    const diffTime = Math.abs(this.end_date - this.start_date);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
  }
  return 0;
});

// Virtual for trip status
tripSchema.virtual('status').get(function() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startDate = new Date(this.start_date.getFullYear(), this.start_date.getMonth(), this.start_date.getDate());
  const endDate = new Date(this.end_date.getFullYear(), this.end_date.getMonth(), this.end_date.getDate());
  
  if (today < startDate) {
    return 'upcoming';
  } else if (today >= startDate && today <= endDate) {
    return 'ongoing';
  } else {
    return 'completed';
  }
});

// Index for efficient queries
tripSchema.index({ user_id: 1, start_date: -1 });
tripSchema.index({ destination: 1 });
tripSchema.index({ start_date: 1, end_date: 1 });

// Pre-save middleware to validate dates
tripSchema.pre('save', function(next) {
  if (this.start_date && this.end_date) {
    if (this.start_date > this.end_date) {
      return next(new Error('Start date must be before or equal to end date'));
    }
  }
  next();
});

// Static methods
tripSchema.statics.findByUser = function(userId) {
  return this.find({ user_id: userId }).sort({ start_date: -1 });
};

tripSchema.statics.findUpcoming = function(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return this.find({
    user_id: userId,
    start_date: { $gte: today }
  }).sort({ start_date: 1 });
};

tripSchema.statics.findOngoing = function(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return this.find({
    user_id: userId,
    start_date: { $lte: today },
    end_date: { $gte: today }
  });
};

tripSchema.statics.findCompleted = function(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return this.find({
    user_id: userId,
    end_date: { $lt: today }
  }).sort({ end_date: -1 });
};

// Instance methods
tripSchema.methods.isUpcoming = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return this.start_date >= today;
};

tripSchema.methods.isOngoing = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return this.start_date <= today && this.end_date >= today;
};

tripSchema.methods.isCompleted = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return this.end_date < today;
};

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
