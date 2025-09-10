const express = require('express');
const router = express.Router();
const {
  createItinerary,
  getTripItinerary,
  getTripItinerarySummary,
  getItineraryById,
  updateItinerary,
  deleteItinerary,
  reorderItinerary,
  toggleCompletion,
  bulkCreateItinerary
} = require('../controllers/itineraryController');
const { verifyToken } = require('../middleware/auth');

// All itinerary routes require authentication
router.use(verifyToken);

// @route   POST /api/itinerary
// @desc    Create a new itinerary item
// @access  Private
router.post('/', createItinerary);

// @route   POST /api/itinerary/bulk
// @desc    Create multiple itinerary items at once
// @access  Private
router.post('/bulk', bulkCreateItinerary);

// @route   GET /api/itinerary/trip/:trip_id
// @desc    Get all itinerary items for a trip
// @access  Private
// @query   day, category, completed (optional filters)
router.get('/trip/:trip_id', getTripItinerary);

// @route   GET /api/itinerary/trip/:trip_id/summary
// @desc    Get itinerary summary for a trip
// @access  Private
router.get('/trip/:trip_id/summary', getTripItinerarySummary);

// @route   GET /api/itinerary/:id
// @desc    Get a specific itinerary item by ID
// @access  Private
router.get('/:id', getItineraryById);

// @route   PUT /api/itinerary/:id
// @desc    Update an itinerary item
// @access  Private
router.put('/:id', updateItinerary);

// @route   DELETE /api/itinerary/:id
// @desc    Delete an itinerary item
// @access  Private
router.delete('/:id', deleteItinerary);

// @route   PUT /api/itinerary/trip/:trip_id/reorder
// @desc    Reorder itinerary items within a day
// @access  Private
router.put('/trip/:trip_id/reorder', reorderItinerary);

// @route   PATCH /api/itinerary/:id/toggle-completion
// @desc    Toggle completion status of an itinerary item
// @access  Private
router.patch('/:id/toggle-completion', toggleCompletion);

module.exports = router;
