const express = require('express');
const router = express.Router();
const {
  createTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  getTripStats,
  searchPlace
} = require('../controllers/tripController');
const { verifyToken } = require('../middleware/auth');

// All trip routes require authentication
router.use(verifyToken);

// @route   GET /api/trips/search-place
// @desc    Search for places using Google Places API
// @access  Private
// @query   query (required)
router.get('/search-place', searchPlace);

// @route   POST /api/trips
// @desc    Create a new trip
// @access  Private
router.post('/', createTrip);

// @route   GET /api/trips
// @desc    Get all trips for the authenticated user
// @access  Private
// @query   status (upcoming|ongoing|completed), page, limit, sort
router.get('/', getUserTrips);

// @route   GET /api/trips/stats
// @desc    Get trip statistics for the authenticated user
// @access  Private
router.get('/stats', getTripStats);

// @route   GET /api/trips/:id
// @desc    Get a specific trip by ID
// @access  Private
router.get('/:id', getTripById);

// @route   PUT /api/trips/:id
// @desc    Update a trip
// @access  Private
router.put('/:id', updateTrip);

// @route   DELETE /api/trips/:id
// @desc    Delete a trip
// @access  Private
router.delete('/:id', deleteTrip);

module.exports = router;
