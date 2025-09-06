# Trip Management API Documentation

## Overview
The Trip Management API allows users to create, manage, and track their travel plans. Each user can have multiple trips with destinations, dates, and budgets.

## Base URL
```
http://localhost:5000/api/trips
```

## Authentication
All endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. Create Trip
**POST** `/api/trips`

Create a new trip for the authenticated user.

#### Request Body
```json
{
  "destination": "Paris, France",
  "start_date": "2024-06-15",
  "end_date": "2024-06-22",
  "total_budget": 2500.00
}
```

#### Required Fields
- `destination` (string): Trip destination (max 255 characters)
- `start_date` (date): Trip start date (YYYY-MM-DD format)
- `end_date` (date): Trip end date (YYYY-MM-DD format)

#### Optional Fields
- `total_budget` (number): Total budget for the trip

#### Response (201)
```json
{
  "success": true,
  "message": "Trip created successfully",
  "trip": {
    "trip_id": "64f8a1234567890abcdef123",
    "user_id": "64f8a1234567890abcdef456",
    "destination": "Paris, France",
    "start_date": "2024-06-15T00:00:00.000Z",
    "end_date": "2024-06-22T00:00:00.000Z",
    "total_budget": 2500,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z",
    "duration_days": 8,
    "status": "upcoming"
  }
}
```

#### Error Responses
```json
// 400 - Validation Error
{
  "success": false,
  "message": "Destination, start date, and end date are required"
}

// 400 - Date Validation Error
{
  "success": false,
  "message": "Start date cannot be in the past"
}
```

---

### 2. Get User Trips
**GET** `/api/trips`

Retrieve all trips for the authenticated user with optional filtering and pagination.

#### Query Parameters
- `status` (optional): Filter by trip status (`upcoming`, `ongoing`, `completed`)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of trips per page (default: 10)
- `sort` (optional): Sort field (`start_date`, `end_date`, `destination`, `created_at`) (default: `start_date`)

#### Example Requests
```
GET /api/trips
GET /api/trips?status=upcoming
GET /api/trips?page=2&limit=5
GET /api/trips?status=completed&sort=end_date
```

#### Response (200)
```json
{
  "success": true,
  "trips": [
    {
      "trip_id": "64f8a1234567890abcdef123",
      "user_id": "64f8a1234567890abcdef456",
      "destination": "Paris, France",
      "start_date": "2024-06-15T00:00:00.000Z",
      "end_date": "2024-06-22T00:00:00.000Z",
      "total_budget": 2500,
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z",
      "duration_days": 8,
      "status": "upcoming"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 3,
    "total_trips": 25,
    "has_next": true,
    "has_prev": false
  }
}
```

---

### 3. Get Trip by ID
**GET** `/api/trips/:id`

Retrieve a specific trip by its ID.

#### Path Parameters
- `id`: Trip ID

#### Response (200)
```json
{
  "success": true,
  "trip": {
    "trip_id": "64f8a1234567890abcdef123",
    "user_id": "64f8a1234567890abcdef456",
    "destination": "Paris, France",
    "start_date": "2024-06-15T00:00:00.000Z",
    "end_date": "2024-06-22T00:00:00.000Z",
    "total_budget": 2500,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z",
    "duration_days": 8,
    "status": "upcoming"
  }
}
```

#### Error Response (404)
```json
{
  "success": false,
  "message": "Trip not found"
}
```

---

### 4. Update Trip
**PUT** `/api/trips/:id`

Update an existing trip. Only the trip owner can update their trips.

#### Path Parameters
- `id`: Trip ID

#### Request Body (all fields optional)
```json
{
  "destination": "Tokyo, Japan",
  "start_date": "2024-07-01",
  "end_date": "2024-07-10",
  "total_budget": 3000.00
}
```

#### Response (200)
```json
{
  "success": true,
  "message": "Trip updated successfully",
  "trip": {
    "trip_id": "64f8a1234567890abcdef123",
    "user_id": "64f8a1234567890abcdef456",
    "destination": "Tokyo, Japan",
    "start_date": "2024-07-01T00:00:00.000Z",
    "end_date": "2024-07-10T00:00:00.000Z",
    "total_budget": 3000,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-20T14:45:00.000Z",
    "duration_days": 10,
    "status": "upcoming"
  }
}
```

---

### 5. Delete Trip
**DELETE** `/api/trips/:id`

Delete a trip. Only the trip owner can delete their trips.

#### Path Parameters
- `id`: Trip ID

#### Response (200)
```json
{
  "success": true,
  "message": "Trip deleted successfully"
}
```

#### Error Response (404)
```json
{
  "success": false,
  "message": "Trip not found"
}
```

---

### 6. Get Trip Statistics
**GET** `/api/trips/stats`

Get statistics about the user's trips.

#### Response (200)
```json
{
  "success": true,
  "stats": {
    "total_trips": 15,
    "total_budget": 25000,
    "upcoming_trips": 3,
    "ongoing_trips": 1,
    "completed_trips": 11
  }
}
```

## Data Model

### Trip Object
```javascript
{
  trip_id: ObjectId,           // Unique trip identifier
  user_id: ObjectId,           // Reference to User model
  destination: String,         // Trip destination (max 255 chars)
  start_date: Date,           // Trip start date
  end_date: Date,             // Trip end date
  total_budget: Number,       // Optional budget (can be null)
  created_at: Date,           // Creation timestamp
  updated_at: Date,           // Last update timestamp
  duration_days: Number,      // Virtual: calculated trip duration
  status: String              // Virtual: "upcoming", "ongoing", "completed"
}
```

### Trip Status Logic
- **Upcoming**: `start_date >= today`
- **Ongoing**: `start_date <= today <= end_date`
- **Completed**: `end_date < today`

## Validation Rules

### Date Validation
- `start_date` cannot be in the past
- `end_date` must be >= `start_date`
- Dates must be valid date strings (YYYY-MM-DD format)

### Field Validation
- `destination`: Required, max 255 characters, trimmed
- `total_budget`: Optional, must be >= 0 if provided
- All fields are validated on create and update

## Error Handling

### Common Error Codes
- **400**: Bad Request (validation errors, invalid data)
- **401**: Unauthorized (missing or invalid token)
- **404**: Not Found (trip doesn't exist or doesn't belong to user)
- **500**: Internal Server Error

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (in development)"
}
```

## Usage Examples

### JavaScript/Fetch
```javascript
// Create a trip
const createTrip = async (tripData) => {
  const response = await fetch('/api/trips', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(tripData)
  });
  return response.json();
};

// Get upcoming trips
const getUpcomingTrips = async () => {
  const response = await fetch('/api/trips?status=upcoming', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};

// Update a trip
const updateTrip = async (tripId, updateData) => {
  const response = await fetch(`/api/trips/${tripId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updateData)
  });
  return response.json();
};
```

### cURL Examples
```bash
# Create a trip
curl -X POST http://localhost:5000/api/trips \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "destination": "Bali, Indonesia",
    "start_date": "2024-08-01",
    "end_date": "2024-08-10",
    "total_budget": 1500
  }'

# Get all trips
curl -X GET http://localhost:5000/api/trips \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get trip by ID
curl -X GET http://localhost:5000/api/trips/TRIP_ID \
  -H "Authorization: Bearer YOUR_TOKEN"

# Update a trip
curl -X PUT http://localhost:5000/api/trips/TRIP_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "destination": "Updated Destination",
    "total_budget": 2000
  }'

# Delete a trip
curl -X DELETE http://localhost:5000/api/trips/TRIP_ID \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get trip statistics
curl -X GET http://localhost:5000/api/trips/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Security Notes

1. **Authentication Required**: All endpoints require a valid JWT token
2. **User Isolation**: Users can only access their own trips
3. **Input Validation**: All inputs are validated and sanitized
4. **Date Validation**: Past dates are not allowed for trip creation
5. **Authorization**: Users can only modify/delete their own trips

## Database Indexes

The following indexes are created for optimal performance:
- `{ user_id: 1, start_date: -1 }` - For user trip queries with date sorting
- `{ destination: 1 }` - For destination-based searches
- `{ start_date: 1, end_date: 1 }` - For date range queries
