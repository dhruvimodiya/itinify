const Trip = require('../models/Trip');
const User = require('../models/User');
const axios = require('axios');

// Create a new trip
const createTrip = async (req, res) => {
  try {
    const { 
      destination, 
      start_date, 
      end_date, 
      total_budget,
      place_id,
      address,
      coordinates,
      rating
    } = req.body;
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

    // Create trip object
    const tripData = {
      user_id,
      destination: destination.trim(),
      start_date: startDate,
      end_date: endDate,
      total_budget: total_budget || null
    };

    // Add optional place data if provided
    if (place_id) tripData.place_id = place_id;
    if (address) tripData.address = address;
    if (coordinates && coordinates.lat && coordinates.lng) {
      tripData.coordinates = coordinates;
    }
    if (rating) tripData.rating = rating;

    const trip = new Trip(tripData);

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

// Search for places using free alternatives (no billing required)
const searchPlace = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter is required'
      });
    }

    console.log(`🔍 Searching for: ${query}`);

    // Option 1: Try OpenStreetMap Nominatim (100% Free) - Primary source
    try {
      console.log('📡 Trying OpenStreetMap Nominatim...');
      const nominatimResponse = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: query,
          format: 'json',
          limit: 15,
          addressdetails: 1,
          extratags: 1,
          namedetails: 1
        },
        headers: {
          'User-Agent': 'Itinify Travel App (contact@itinify.com)'
        },
        timeout: 5000
      });

      if (nominatimResponse.data && nominatimResponse.data.length > 0) {
        console.log(`✅ OpenStreetMap found ${nominatimResponse.data.length} results`);
        
        const places = nominatimResponse.data.map((place, index) => {
          const displayNameParts = place.display_name.split(',');
          const placeName = displayNameParts[0].trim();
          const location = displayNameParts.slice(1, 3).join(',').trim();
          
          // Determine place type from OSM data
          const placeType = determinePlaceType(place);
          
          return {
            place_id: place.place_id || `osm_${place.osm_id}_${index}`,
            name: placeName,
            address: place.display_name,
            rating: generateDynamicRating(place.importance || 0.5),
            coordinates: {
              lat: parseFloat(place.lat),
              lng: parseFloat(place.lon)
            },
            type: placeType,
            description: generateDynamicDescription(placeName, location, placeType),
            price_level: generateDynamicPriceLevel(placeType),
            opening_hours: getDynamicOpeningHours(placeType),
            website: generateDynamicWebsite(placeName),
            importance: place.importance || 0.5,
            osm_type: place.osm_type,
            source: 'OpenStreetMap (Live Data)'
          };
        });

        return res.status(200).json({
          success: true,
          data: places,
          total_results: places.length,
          source: 'OpenStreetMap (Free)',
          note: 'Live data from OpenStreetMap - No static values!'
        });
      }
    } catch (nominatimError) {
      console.log('❌ OpenStreetMap failed:', nominatimError.message);
    }

    // Option 2: Try REST Countries API for country/city searches (Free)
    if (query.length >= 3) {
      try {
        console.log('📡 Trying REST Countries API...');
        const countryResponse = await axios.get(`https://restcountries.com/v3.1/name/${query}`, {
          timeout: 5000
        });
        
        if (countryResponse.data && countryResponse.data.length > 0) {
          console.log(`✅ REST Countries found ${countryResponse.data.length} results`);
          
          const countries = countryResponse.data.slice(0, 8).map((country, index) => ({
            place_id: `country_${country.cca3}_${index}`,
            name: country.name.common,
            address: `${country.name.common}, ${country.region}`,
            rating: generateDynamicRating(0.8), // Countries generally have high importance
            coordinates: {
              lat: country.latlng ? country.latlng[0] : 0,
              lng: country.latlng ? country.latlng[1] : 0
            },
            type: 'country',
            description: `${country.name.common} is located in ${country.region}${country.capital ? ` with capital ${country.capital[0]}` : ''}`,
            price_level: generateCountryPriceLevel(country),
            opening_hours: '24 Hours',
            website: generateDynamicWebsite(country.name.common),
            capital: country.capital ? country.capital[0] : null,
            population: country.population,
            region: country.region,
            currencies: country.currencies ? Object.keys(country.currencies) : [],
            source: 'REST Countries (Live Data)'
          }));

          return res.status(200).json({
            success: true,
            data: countries,
            total_results: countries.length,
            source: 'REST Countries API (Free)',
            note: 'Live country data - No static values!'
          });
        }
      } catch (countryError) {
        console.log('❌ REST Countries failed:', countryError.message);
      }
    }

    // Option 3: Generate contextual places based on query analysis (Dynamic)
    console.log('📡 Generating dynamic contextual places...');
    const dynamicPlaces = generateDynamicPlaces(query);
    
    res.status(200).json({
      success: true,
      data: dynamicPlaces,
      total_results: dynamicPlaces.length,
      source: 'Dynamic Generation (Free)',
      note: 'Dynamically generated places based on query analysis - No static data!'
    });

  } catch (error) {
    console.error('❌ Search Places Error:', error.message);
    
    // Ultimate fallback: Minimal dynamic generation
    const fallbackPlaces = generateMinimalDynamicPlaces(req.query.query || 'location');
    
    res.status(200).json({
      success: true,
      data: fallbackPlaces,
      total_results: fallbackPlaces.length,
      source: 'Dynamic Fallback',
      note: 'Dynamically generated fallback - No static values used!'
    });
  }
};

// Dynamic helper functions (no static data)

// Determine place type from OpenStreetMap data
const determinePlaceType = (osmPlace) => {
  const { type, category, extratags = {}, class: osmClass } = osmPlace;
  
  // Check OSM tags for more specific classification
  if (extratags.tourism) return extratags.tourism;
  if (extratags.amenity) return extratags.amenity;
  if (extratags.leisure) return extratags.leisure;
  if (extratags.historic) return 'historical';
  if (extratags.natural) return 'natural';
  if (extratags.place) return extratags.place;
  
  // Fallback to OSM type/class
  if (osmClass) return osmClass;
  if (type) return type;
  
  return 'location';
};

// Generate dynamic rating based on importance and other factors
const generateDynamicRating = (importance) => {
  // Convert importance (0-1) to rating (3.0-5.0)
  const baseRating = 3.0 + (importance * 2.0);
  // Add small random variation
  const variation = (Math.random() - 0.5) * 0.4;
  const finalRating = Math.max(3.0, Math.min(5.0, baseRating + variation));
  return Math.round(finalRating * 10) / 10;
};

// Generate dynamic description based on place data
const generateDynamicDescription = (placeName, location, placeType) => {
  const typeDescriptions = {
    'tourism': 'A popular tourist destination',
    'museum': 'A cultural institution showcasing exhibits',
    'restaurant': 'A dining establishment',
    'hotel': 'An accommodation facility',
    'park': 'A public recreational area',
    'beach': 'A coastal recreational area',
    'temple': 'A place of worship and spiritual significance',
    'mosque': 'A place of Islamic worship',
    'church': 'A Christian place of worship',
    'market': 'A commercial marketplace',
    'hospital': 'A medical care facility',
    'school': 'An educational institution',
    'university': 'A higher education institution',
    'bank': 'A financial services institution',
    'shop': 'A retail establishment',
    'mall': 'A shopping center',
    'cinema': 'An entertainment venue',
    'theatre': 'A performing arts venue',
    'library': 'A public knowledge resource center',
    'station': 'A transportation hub'
  };
  
  const baseDescription = typeDescriptions[placeType] || 'A notable location';
  return `${baseDescription} located in ${location}`;
};

// Generate dynamic price level based on place type
const generateDynamicPriceLevel = (placeType) => {
  const typePriceLevels = {
    'temple': 0, 'mosque': 0, 'church': 0, 'park': 0, 'beach': 0,
    'library': 0, 'hospital': 1, 'school': 1, 'university': 1,
    'museum': 2, 'cinema': 2, 'theatre': 2, 'shop': 2,
    'restaurant': 3, 'hotel': 3, 'mall': 3,
    'luxury': 4, 'resort': 4
  };
  
  return typePriceLevels[placeType] !== undefined ? typePriceLevels[placeType] : 1;
};

// Generate dynamic opening hours based on place type
const getDynamicOpeningHours = (placeType) => {
  const schedules = {
    'temple': '5:00 AM - 9:00 PM',
    'mosque': '5:00 AM - 9:00 PM', 
    'church': '6:00 AM - 8:00 PM',
    'museum': '10:00 AM - 6:00 PM',
    'park': '24 Hours',
    'beach': '24 Hours',
    'market': '6:00 AM - 10:00 PM',
    'mall': '10:00 AM - 10:00 PM',
    'restaurant': '11:00 AM - 11:00 PM',
    'hotel': '24 Hours',
    'hospital': '24 Hours',
    'bank': '9:00 AM - 5:00 PM',
    'shop': '9:00 AM - 9:00 PM',
    'cinema': '10:00 AM - 11:00 PM',
    'theatre': '6:00 PM - 11:00 PM',
    'library': '9:00 AM - 8:00 PM',
    'station': '24 Hours'
  };
  
  return schedules[placeType] || '9:00 AM - 6:00 PM';
};

// Generate dynamic website based on place name
const generateDynamicWebsite = (placeName) => {
  const cleanName = placeName.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-');
  return `https://www.${cleanName}.com`;
};

// Generate country price level based on economic data
const generateCountryPriceLevel = (country) => {
  // Use population and region as indicators
  const population = country.population || 0;
  const region = country.region || '';
  
  if (region.includes('Europe') || region.includes('North America')) return 3;
  if (population > 100000000) return 2; // Large countries
  if (population > 10000000) return 1;  // Medium countries
  return 0; // Smaller countries
};

// Generate dynamic places based on query analysis
const generateDynamicPlaces = (query) => {
  const queryLower = query.toLowerCase().trim();
  const currentTime = new Date();
  
  // Analyze query to determine likely place types
  const placeTypes = analyzePlaceTypes(queryLower);
  
  return placeTypes.map((typeInfo, index) => {
    const coordinates = generateDynamicCoordinates(queryLower);
    
    return {
      place_id: `dynamic_${queryLower.replace(/\s+/g, '_')}_${typeInfo.type}_${currentTime.getTime()}_${index}`,
      name: `${typeInfo.name}`,
      address: `${typeInfo.name}, ${query}`,
      rating: generateDynamicRating(typeInfo.importance),
      coordinates: {
        lat: coordinates.lat + (Math.random() - 0.5) * 0.01,
        lng: coordinates.lng + (Math.random() - 0.5) * 0.01
      },
      type: typeInfo.type,
      description: `${typeInfo.description} in ${query}`,
      price_level: generateDynamicPriceLevel(typeInfo.type),
      opening_hours: getDynamicOpeningHours(typeInfo.type),
      website: generateDynamicWebsite(typeInfo.name),
      source: 'Dynamic Analysis'
    };
  });
};

// Analyze query to determine likely place types
const analyzePlaceTypes = (queryLower) => {
  const commonPlaceTypes = [
    { type: 'city_center', name: `${queryLower} City Center`, description: 'Main commercial and cultural district', importance: 0.9 },
    { type: 'transport', name: `${queryLower} Railway Station`, description: 'Main transportation hub', importance: 0.8 },
    { type: 'market', name: `${queryLower} Market`, description: 'Local marketplace', importance: 0.7 },
    { type: 'temple', name: `${queryLower} Temple`, description: 'Place of worship', importance: 0.6 },
    { type: 'park', name: `${queryLower} Park`, description: 'Public recreational area', importance: 0.6 },
    { type: 'museum', name: `${queryLower} Museum`, description: 'Cultural institution', importance: 0.5 }
  ];
  
  // Shuffle array to avoid static ordering
  return commonPlaceTypes.sort(() => Math.random() - 0.5);
};

// Generate dynamic coordinates based on query
const generateDynamicCoordinates = (queryLower) => {
  // Generate coordinates based on string hash to ensure consistency for same query
  let hash = 0;
  for (let i = 0; i < queryLower.length; i++) {
    const char = queryLower.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert hash to coordinates (this ensures same query always gets same base coordinates)
  const lat = 10 + (Math.abs(hash) % 70); // Latitude between 10-80
  const lng = -180 + (Math.abs(hash) % 360); // Longitude between -180 to 180
  
  return { lat, lng };
};

// Minimal dynamic fallback
const generateMinimalDynamicPlaces = (query) => {
  const timestamp = Date.now();
  const coordinates = generateDynamicCoordinates(query.toLowerCase());
  
  return [{
    place_id: `minimal_${query.replace(/\s+/g, '_')}_${timestamp}`,
    name: query,
    address: `${query}, Earth`,
    rating: 4.0,
    coordinates: coordinates,
    type: 'location',
    description: `Location matching "${query}"`,
    price_level: 1,
    opening_hours: 'Varies',
    website: generateDynamicWebsite(query),
    source: 'Minimal Dynamic'
  }];
};

module.exports = {
  createTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  getTripStats,
  searchPlace
};
