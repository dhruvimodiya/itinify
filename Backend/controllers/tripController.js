const Trip = require('../models/Trip');
const User = require('../models/User');

// Create a new trip
const createTrip = async (req, res) => {
  try {
    const { destination, start_date, end_date, total_budget } = req.body;
    const user_id = req.user.id;

    // Validate required fields
    if (!destination || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: 'Destination, start date, and end date are required'
      });
    }

    // Validate dates
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Start date cannot be in the past'
      });
    }

    if (endDate < startDate) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after or equal to start date'
      });
    }

    // Create trip
    const trip = new Trip({
      user_id,
      destination: destination.trim(),
      start_date: startDate,
      end_date: endDate,
      total_budget: total_budget || null
    });

    await trip.save();

    res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      trip
    });

  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create trip',
      error: error.message
    });
  }
};

// Get all trips for the authenticated user
const getUserTrips = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { status, page = 1, limit = 10, sort = 'start_date' } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let query = { user_id };
    let trips;

    // Filter by status if provided
    if (status) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      switch (status.toLowerCase()) {
        case 'upcoming':
          query.start_date = { $gte: today };
          break;
        case 'ongoing':
          query.start_date = { $lte: today };
          query.end_date = { $gte: today };
          break;
        case 'completed':
          query.end_date = { $lt: today };
          break;
        default:
          return res.status(400).json({
            success: false,
            message: 'Invalid status. Use: upcoming, ongoing, or completed'
          });
      }
    }

    // Sort options
    let sortOption = {};
    switch (sort) {
      case 'start_date':
        sortOption = { start_date: -1 };
        break;
      case 'end_date':
        sortOption = { end_date: -1 };
        break;
      case 'destination':
        sortOption = { destination: 1 };
        break;
      case 'created_at':
        sortOption = { created_at: -1 };
        break;
      default:
        sortOption = { start_date: -1 };
    }

    trips = await Trip.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    const total = await Trip.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      trips,
      pagination: {
        current_page: pageNum,
        total_pages: totalPages,
        total_trips: total,
        has_next: pageNum < totalPages,
        has_prev: pageNum > 1
      }
    });

  } catch (error) {
    console.error('Get user trips error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trips',
      error: error.message
    });
  }
};

// Get a specific trip by ID
const getTripById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const trip = await Trip.findOne({ _id: id, user_id });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    res.status(200).json({
      success: true,
      trip
    });

  } catch (error) {
    console.error('Get trip by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trip',
      error: error.message
    });
  }
};

// Update a trip
const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const updates = req.body;

    // Find the trip
    const trip = await Trip.findOne({ _id: id, user_id });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Validate dates if being updated
    if (updates.start_date || updates.end_date) {
      const startDate = updates.start_date ? new Date(updates.start_date) : trip.start_date;
      const endDate = updates.end_date ? new Date(updates.end_date) : trip.end_date;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDate < today && updates.start_date) {
        return res.status(400).json({
          success: false,
          message: 'Start date cannot be in the past'
        });
      }

      if (endDate < startDate) {
        return res.status(400).json({
          success: false,
          message: 'End date must be after or equal to start date'
        });
      }
    }

    // Update allowed fields
    const allowedUpdates = ['destination', 'start_date', 'end_date', 'total_budget'];
    const updateData = {};

    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        updateData[field] = updates[field];
      }
    });

    if (updateData.destination) {
      updateData.destination = updateData.destination.trim();
    }

    const updatedTrip = await Trip.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Trip updated successfully',
      trip: updatedTrip
    });

  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update trip',
      error: error.message
    });
  }
};

// Delete a trip
const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const trip = await Trip.findOneAndDelete({ _id: id, user_id });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Trip deleted successfully'
    });

  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete trip',
      error: error.message
    });
  }
};

// Get trip statistics for the user
const getTripStats = async (req, res) => {
  try {
    const user_id = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = await Trip.aggregate([
      { $match: { user_id: user_id } },
      {
        $group: {
          _id: null,
          total_trips: { $sum: 1 },
          total_budget: { $sum: '$total_budget' },
          upcoming_trips: {
            $sum: {
              $cond: [{ $gte: ['$start_date', today] }, 1, 0]
            }
          },
          ongoing_trips: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lte: ['$start_date', today] },
                    { $gte: ['$end_date', today] }
                  ]
                },
                1,
                0
              ]
            }
          },
          completed_trips: {
            $sum: {
              $cond: [{ $lt: ['$end_date', today] }, 1, 0]
            }
          }
        }
      }
    ]);

    const result = stats[0] || {
      total_trips: 0,
      total_budget: 0,
      upcoming_trips: 0,
      ongoing_trips: 0,
      completed_trips: 0
    };

    res.status(200).json({
      success: true,
      stats: result
    });

  } catch (error) {
    console.error('Get trip stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trip statistics',
      error: error.message
    });
  }
};

module.exports = {
  createTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  getTripStats
};
