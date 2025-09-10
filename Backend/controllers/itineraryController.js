const Itinerary = require('../models/Itinerary');
const Trip = require('../models/Trip');

// Create a new itinerary item
const createItinerary = async (req, res) => {
  try {
    const { trip_id, day_number, activity, description, location, start_time, end_time, cost, priority, category, notes } = req.body;
    const user_id = req.user.id;

    // Validate required fields
    if (!trip_id || !day_number || !activity) {
      return res.status(400).json({
        success: false,
        message: 'Trip ID, day number, and activity are required'
      });
    }

    // Verify trip belongs to user
    const trip = await Trip.findOne({ _id: trip_id, user_id });
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found or you do not have access to it'
      });
    }

    // Validate day number is within trip duration
    const tripDays = Math.ceil((trip.end_date - trip.start_date) / (1000 * 60 * 60 * 24)) + 1;
    if (day_number > tripDays || day_number < 1) {
      return res.status(400).json({
        success: false,
        message: `Day number must be between 1 and ${tripDays}`
      });
    }

    // Get the next order_index for this day
    const existingActivities = await Itinerary.find({ trip_id, day_number }).sort({ order_index: -1 }).limit(1);
    const order_index = existingActivities.length > 0 ? existingActivities[0].order_index + 1 : 0;

    // Create itinerary item
    const itinerary = new Itinerary({
      trip_id,
      day_number: parseInt(day_number),
      activity: activity.trim(),
      description: description ? description.trim() : '',
      location: location ? location.trim() : '',
      start_time,
      end_time,
      cost: cost || 0,
      priority: priority || 'medium',
      category: category || 'other',
      notes: notes ? notes.trim() : '',
      order_index
    });

    await itinerary.save();

    res.status(201).json({
      success: true,
      message: 'Itinerary item created successfully',
      itinerary
    });

  } catch (error) {
    console.error('Create itinerary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create itinerary item',
      error: error.message
    });
  }
};

// Get all itinerary items for a trip
const getTripItinerary = async (req, res) => {
  try {
    const { trip_id } = req.params;
    const user_id = req.user.id;
    const { day, category, completed } = req.query;

    // Verify trip belongs to user
    const trip = await Trip.findOne({ _id: trip_id, user_id });
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found or you do not have access to it'
      });
    }

    let query = { trip_id };

    // Apply filters
    if (day) {
      query.day_number = parseInt(day);
    }
    if (category) {
      query.category = category;
    }
    if (completed !== undefined) {
      query.is_completed = completed === 'true';
    }

    const itinerary = await Itinerary.find(query)
      .sort({ day_number: 1, order_index: 1, start_time: 1 });

    // Group by days
    const groupedItinerary = {};
    itinerary.forEach(item => {
      if (!groupedItinerary[item.day_number]) {
        groupedItinerary[item.day_number] = [];
      }
      groupedItinerary[item.day_number].push(item);
    });

    res.status(200).json({
      success: true,
      trip: {
        trip_id: trip._id,
        destination: trip.destination,
        start_date: trip.start_date,
        end_date: trip.end_date,
        duration_days: trip.duration_days
      },
      itinerary: groupedItinerary,
      total_items: itinerary.length
    });

  } catch (error) {
    console.error('Get trip itinerary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch itinerary',
      error: error.message
    });
  }
};

// Get itinerary summary for a trip
const getTripItinerarySummary = async (req, res) => {
  try {
    const { trip_id } = req.params;
    const user_id = req.user.id;

    // Verify trip belongs to user
    const trip = await Trip.findOne({ _id: trip_id, user_id });
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found or you do not have access to it'
      });
    }

    const summary = await Itinerary.getTripSummary(trip_id);

    // Calculate overall statistics
    const totalActivities = summary.reduce((sum, day) => sum + day.activities_count, 0);
    const totalCost = summary.reduce((sum, day) => sum + day.total_cost, 0);
    const totalCompleted = summary.reduce((sum, day) => sum + day.completed_count, 0);
    const overallCompletion = totalActivities > 0 ? (totalCompleted / totalActivities * 100) : 0;

    // Category breakdown
    const categoryStats = await Itinerary.aggregate([
      { $match: { trip_id: new Itinerary.base.Types.ObjectId(trip_id) } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          total_cost: { $sum: '$cost' },
          completed: { $sum: { $cond: [{ $eq: ['$is_completed', true] }, 1, 0] } }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      trip: {
        trip_id: trip._id,
        destination: trip.destination,
        start_date: trip.start_date,
        end_date: trip.end_date,
        duration_days: trip.duration_days
      },
      summary: {
        daily_breakdown: summary,
        overall_stats: {
          total_activities: totalActivities,
          total_cost: totalCost,
          completed_activities: totalCompleted,
          completion_percentage: Math.round(overallCompletion * 100) / 100
        },
        category_breakdown: categoryStats
      }
    });

  } catch (error) {
    console.error('Get trip itinerary summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch itinerary summary',
      error: error.message
    });
  }
};

// Get a specific itinerary item
const getItineraryById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const itinerary = await Itinerary.findById(id).populate('trip_id');

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: 'Itinerary item not found'
      });
    }

    // Verify trip belongs to user
    if (itinerary.trip_id.user_id.toString() !== user_id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this itinerary item'
      });
    }

    res.status(200).json({
      success: true,
      itinerary
    });

  } catch (error) {
    console.error('Get itinerary by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch itinerary item',
      error: error.message
    });
  }
};

// Update an itinerary item
const updateItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const updates = req.body;

    // Find the itinerary item with trip info
    const itinerary = await Itinerary.findById(id).populate('trip_id');

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: 'Itinerary item not found'
      });
    }

    // Verify trip belongs to user
    if (itinerary.trip_id.user_id.toString() !== user_id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this itinerary item'
      });
    }

    // Validate day number if being updated
    if (updates.day_number) {
      const tripDays = Math.ceil((itinerary.trip_id.end_date - itinerary.trip_id.start_date) / (1000 * 60 * 60 * 24)) + 1;
      if (updates.day_number > tripDays || updates.day_number < 1) {
        return res.status(400).json({
          success: false,
          message: `Day number must be between 1 and ${tripDays}`
        });
      }
    }

    // Update allowed fields
    const allowedUpdates = ['activity', 'description', 'location', 'start_time', 'end_time', 'cost', 'priority', 'category', 'notes', 'day_number', 'is_completed'];
    const updateData = {};
    
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        updateData[field] = updates[field];
      }
    });

    // Trim string fields
    ['activity', 'description', 'location', 'notes'].forEach(field => {
      if (updateData[field] && typeof updateData[field] === 'string') {
        updateData[field] = updateData[field].trim();
      }
    });

    const updatedItinerary = await Itinerary.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Itinerary item updated successfully',
      itinerary: updatedItinerary
    });

  } catch (error) {
    console.error('Update itinerary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update itinerary item',
      error: error.message
    });
  }
};

// Delete an itinerary item
const deleteItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Find the itinerary item with trip info
    const itinerary = await Itinerary.findById(id).populate('trip_id');

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: 'Itinerary item not found'
      });
    }

    // Verify trip belongs to user
    if (itinerary.trip_id.user_id.toString() !== user_id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this itinerary item'
      });
    }

    await Itinerary.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Itinerary item deleted successfully'
    });

  } catch (error) {
    console.error('Delete itinerary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete itinerary item',
      error: error.message
    });
  }
};

// Reorder itinerary items within a day
const reorderItinerary = async (req, res) => {
  try {
    const { trip_id } = req.params;
    const { day_number, items } = req.body;
    const user_id = req.user.id;

    // Verify trip belongs to user
    const trip = await Trip.findOne({ _id: trip_id, user_id });
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found or you do not have access to it'
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Items array is required and must not be empty'
      });
    }

    // Update order_index for each item
    const updatePromises = items.map((itemId, index) => {
      return Itinerary.findOneAndUpdate(
        { 
          _id: itemId, 
          trip_id, 
          day_number: parseInt(day_number)
        },
        { order_index: index },
        { new: true }
      );
    });

    const updatedItems = await Promise.all(updatePromises);

    // Filter out null results (items that weren't found)
    const validUpdates = updatedItems.filter(item => item !== null);

    if (validUpdates.length !== items.length) {
      return res.status(400).json({
        success: false,
        message: 'Some items could not be updated. Please refresh and try again.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Itinerary items reordered successfully',
      updated_items: validUpdates
    });

  } catch (error) {
    console.error('Reorder itinerary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder itinerary items',
      error: error.message
    });
  }
};

// Toggle completion status
const toggleCompletion = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Find the itinerary item with trip info
    const itinerary = await Itinerary.findById(id).populate('trip_id');

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: 'Itinerary item not found'
      });
    }

    // Verify trip belongs to user
    if (itinerary.trip_id.user_id.toString() !== user_id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this itinerary item'
      });
    }

    // Toggle completion status
    itinerary.is_completed = !itinerary.is_completed;
    await itinerary.save();

    res.status(200).json({
      success: true,
      message: `Itinerary item marked as ${itinerary.is_completed ? 'completed' : 'incomplete'}`,
      itinerary
    });

  } catch (error) {
    console.error('Toggle completion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle completion status',
      error: error.message
    });
  }
};

// Bulk operations (create multiple items, update multiple items, etc.)
const bulkCreateItinerary = async (req, res) => {
  try {
    const { trip_id, items } = req.body;
    const user_id = req.user.id;

    // Verify trip belongs to user
    const trip = await Trip.findOne({ _id: trip_id, user_id });
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found or you do not have access to it'
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Items array is required and must not be empty'
      });
    }

    const tripDays = Math.ceil((trip.end_date - trip.start_date) / (1000 * 60 * 60 * 24)) + 1;

    // Validate and prepare items
    const validatedItems = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (!item.day_number || !item.activity) {
        return res.status(400).json({
          success: false,
          message: `Item ${i + 1}: Day number and activity are required`
        });
      }

      if (item.day_number > tripDays || item.day_number < 1) {
        return res.status(400).json({
          success: false,
          message: `Item ${i + 1}: Day number must be between 1 and ${tripDays}`
        });
      }

      // Get next order_index for this day
      const existingCount = await Itinerary.countDocuments({ 
        trip_id, 
        day_number: item.day_number 
      });

      validatedItems.push({
        trip_id,
        day_number: parseInt(item.day_number),
        activity: item.activity.trim(),
        description: item.description ? item.description.trim() : '',
        location: item.location ? item.location.trim() : '',
        start_time: item.start_time || null,
        end_time: item.end_time || null,
        cost: item.cost || 0,
        priority: item.priority || 'medium',
        category: item.category || 'other',
        notes: item.notes ? item.notes.trim() : '',
        order_index: existingCount + i
      });
    }

    const createdItems = await Itinerary.insertMany(validatedItems);

    res.status(201).json({
      success: true,
      message: `${createdItems.length} itinerary items created successfully`,
      items: createdItems
    });

  } catch (error) {
    console.error('Bulk create itinerary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create itinerary items',
      error: error.message
    });
  }
};

module.exports = {
  createItinerary,
  getTripItinerary,
  getTripItinerarySummary,
  getItineraryById,
  updateItinerary,
  deleteItinerary,
  reorderItinerary,
  toggleCompletion,
  bulkCreateItinerary
};
