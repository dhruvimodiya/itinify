const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  trip_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
    index: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'accommodation',
      'transportation',
      'food',
      'activities',
      'shopping',
      'entertainment',
      'healthcare',
      'communication',
      'tips',
      'emergency',
      'other'
    ],
    index: true
  },
  subcategory: {
    type: String,
    trim: true,
    maxlength: 100,
    default: ''
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function(value) {
        return value > 0;
      },
      message: 'Amount must be greater than zero'
    }
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true,
    minlength: 3,
    maxlength: 3,
    validate: {
      validator: function(value) {
        // Basic currency code validation
        return /^[A-Z]{3}$/.test(value);
      },
      message: 'Currency must be a valid 3-letter code (e.g., USD, EUR)'
    }
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  location: {
    type: String,
    trim: true,
    maxlength: 255,
    default: ''
  },
  expense_date: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  payment_method: {
    type: String,
    enum: ['cash', 'credit_card', 'debit_card', 'digital_wallet', 'bank_transfer', 'other'],
    default: 'cash'
  },
  receipt_url: {
    type: String,
    trim: true,
    validate: {
      validator: function(value) {
        if (!value) return true;
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      },
      message: 'Receipt URL must be a valid URL'
    }
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 1000,
    default: ''
  },
  is_shared: {
    type: Boolean,
    default: false
  },
  shared_with: [{
    type: String,
    trim: true
  }],
  split_amount: {
    type: Number,
    default: null,
    min: 0,
    validate: {
      validator: function(value) {
        if (value === null || value === undefined) return true;
        return value <= this.amount;
      },
      message: 'Split amount cannot be greater than total amount'
    }
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: 50
  }],
  is_planned: {
    type: Boolean,
    default: false
  },
  is_essential: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  },
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      ret.expense_id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Virtual for formatted amount with currency
expenseSchema.virtual('formatted_amount').get(function() {
  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    INR: '₹',
    CAD: 'C$',
    AUD: 'A$'
  };
  
  const symbol = currencySymbols[this.currency] || this.currency;
  return `${symbol}${this.amount.toFixed(2)}`;
});

// Virtual for split responsibility
expenseSchema.virtual('my_share').get(function() {
  if (this.is_shared && this.split_amount !== null) {
    return this.split_amount;
  }
  return this.amount;
});

// Virtual for others' share
expenseSchema.virtual('others_share').get(function() {
  if (this.is_shared && this.split_amount !== null) {
    return this.amount - this.split_amount;
  }
  return 0;
});

// Indexes for efficient queries
expenseSchema.index({ trip_id: 1, expense_date: -1 });
expenseSchema.index({ trip_id: 1, category: 1 });
expenseSchema.index({ user_id: 1, expense_date: -1 });
expenseSchema.index({ trip_id: 1, is_planned: 1 });
expenseSchema.index({ trip_id: 1, is_essential: 1 });

// Static methods for analytics and reporting
expenseSchema.statics.getTripExpenseSummary = function(tripId) {
  return this.aggregate([
    { $match: { trip_id: new mongoose.Types.ObjectId(tripId) } },
    {
      $group: {
        _id: '$category',
        total_amount: { $sum: '$amount' },
        count: { $sum: 1 },
        avg_amount: { $avg: '$amount' },
        planned_amount: { 
          $sum: { $cond: [{ $eq: ['$is_planned', true] }, '$amount', 0] } 
        },
        actual_amount: { 
          $sum: { $cond: [{ $eq: ['$is_planned', false] }, '$amount', 0] } 
        }
      }
    },
    { $sort: { total_amount: -1 } },
    {
      $project: {
        category: '$_id',
        total_amount: 1,
        count: 1,
        avg_amount: { $round: ['$avg_amount', 2] },
        planned_amount: 1,
        actual_amount: 1,
        _id: 0
      }
    }
  ]);
};

expenseSchema.statics.getDailyExpenseBreakdown = function(tripId) {
  return this.aggregate([
    { $match: { trip_id: new mongoose.Types.ObjectId(tripId) } },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$expense_date' }
        },
        daily_total: { $sum: '$amount' },
        expense_count: { $sum: 1 },
        categories: { $addToSet: '$category' },
        expenses: { $push: '$$ROOT' }
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        date: '$_id',
        daily_total: 1,
        expense_count: 1,
        categories: 1,
        expenses: {
          $sortArray: {
            input: '$expenses',
            sortBy: { expense_date: 1 }
          }
        },
        _id: 0
      }
    }
  ]);
};

expenseSchema.statics.getBudgetAnalysis = function(tripId, totalBudget) {
  return this.aggregate([
    { $match: { trip_id: new mongoose.Types.ObjectId(tripId) } },
    {
      $group: {
        _id: null,
        total_spent: { $sum: '$amount' },
        total_planned: { 
          $sum: { $cond: [{ $eq: ['$is_planned', true] }, '$amount', 0] } 
        },
        total_actual: { 
          $sum: { $cond: [{ $eq: ['$is_planned', false] }, '$amount', 0] } 
        },
        expense_count: { $sum: 1 },
        essential_expenses: {
          $sum: { $cond: [{ $eq: ['$is_essential', true] }, '$amount', 0] }
        }
      }
    },
    {
      $project: {
        total_spent: 1,
        total_planned: 1,
        total_actual: 1,
        expense_count: 1,
        essential_expenses: 1,
        total_budget: totalBudget,
        remaining_budget: { $subtract: [totalBudget, '$total_spent'] },
        budget_utilization: {
          $multiply: [
            { $divide: ['$total_spent', totalBudget] },
            100
          ]
        },
        is_over_budget: { $gt: ['$total_spent', totalBudget] },
        _id: 0
      }
    }
  ]);
};

// Instance methods
expenseSchema.methods.markAsShared = function(splitAmount, sharedWith = []) {
  this.is_shared = true;
  this.split_amount = splitAmount;
  this.shared_with = sharedWith;
  return this.save();
};

expenseSchema.methods.markAsEssential = function() {
  this.is_essential = true;
  return this.save();
};

expenseSchema.methods.addTags = function(newTags) {
  const uniqueTags = [...new Set([...this.tags, ...newTags])];
  this.tags = uniqueTags;
  return this.save();
};

// Pre-save middleware to validate expense date within trip duration
expenseSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('trip_id') || this.isModified('expense_date')) {
    try {
      const Trip = mongoose.model('Trip');
      const trip = await Trip.findById(this.trip_id);
      
      if (trip) {
        const expenseDate = new Date(this.expense_date);
        const tripStart = new Date(trip.start_date);
        const tripEnd = new Date(trip.end_date);
        
        // Allow expenses 1 day before trip start and 1 day after trip end
        tripStart.setDate(tripStart.getDate() - 1);
        tripEnd.setDate(tripEnd.getDate() + 1);
        
        if (expenseDate < tripStart || expenseDate > tripEnd) {
          const error = new Error('Expense date should be within trip duration (±1 day buffer)');
          error.name = 'ValidationError';
          return next(error);
        }
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;