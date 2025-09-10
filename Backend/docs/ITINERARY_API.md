# Itinerary Management API Documentation

## Overview
The Itinerary Management API allows users to create, manage, and organize daily activities for their trips. Users can add activities to specific days, set times and costs, categorize activities, and track completion status.

## Base URL
```
http://localhost:5000/api/itinerary
```

## Authentication
All endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Data Models

### Itinerary Item Object
```javascript
{
  itinerary_id: ObjectId,      // Unique itinerary item identifier
  trip_id: ObjectId,           // Reference to Trip model
  day_number: Number,          // Day of the trip (1, 2, 3, etc.)
  activity: String,            // Activity name (required, max 500 chars)
  description: String,         // Activity description (max 1000 chars)
  location: String,            // Activity location (max 255 chars)
  start_time: String,          // Start time in HH:MM format (24-hour)
  end_time: String,            // End time in HH:MM format (24-hour)
  cost: Number,                // Activity cost (min 0, default 0)
  priority: String,            // 'low', 'medium', 'high' (default 'medium')
  category: String,            // Activity category (see categories below)
  is_completed: Boolean,       // Completion status (default false)
  notes: String,               // Additional notes (max 1000 chars)
  order_index: Number,         // Order within the day (for sorting)
  created_at: Date,            // Creation timestamp
  updated_at: Date,            // Last update timestamp
  time_range: String,          // Virtual: formatted time range
  duration_minutes: Number     // Virtual: calculated duration
}
```

### Activity Categories
- `sightseeing` - Sightseeing and attractions
- `food` - Food and dining
- `transport` - Transportation
- `accommodation` - Hotels and lodging
- `shopping` - Shopping activities
- `entertainment` - Entertainment and shows
- `other` - Other activities

### Priority Levels
- `low` - Low priority activity
- `medium` - Medium priority activity (default)
- `high` - High priority activity

## Endpoints

### 1. Create Itinerary Item
**POST** `/api/itinerary`

Create a new itinerary item for a trip.

#### Request Body
```json
{
  "trip_id": "64f8a1234567890abcdef123",
  "day_number": 1,
  "activity": "Visit Eiffel Tower",
  "description": "Iconic iron tower with panoramic city views",
  "location": "Champ de Mars, Paris",
  "start_time": "09:00",
  "end_time": "11:00",
  "cost": 25.50,
  "priority": "high",
  "category": "sightseeing",
  "notes": "Book tickets in advance"
}
```

#### Required Fields
- `trip_id`: Valid trip ID that belongs to the user
- `day_number`: Day number within the trip duration
- `activity`: Activity name

#### Response (201)
```json
{
  "success": true,
  "message": "Itinerary item created successfully",
  "itinerary": {
    "itinerary_id": "64f8a1234567890abcdef789",
    "trip_id": "64f8a1234567890abcdef123",
    "day_number": 1,
    "activity": "Visit Eiffel Tower",
    "description": "Iconic iron tower with panoramic city views",
    "location": "Champ de Mars, Paris",
    "start_time": "09:00",
    "end_time": "11:00",
    "cost": 25.5,
    "priority": "high",
    "category": "sightseeing",
    "is_completed": false,
    "notes": "Book tickets in advance",
    "order_index": 0,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z",
    "time_range": "09:00 - 11:00",
    "duration_minutes": 120
  }
}
```

---

### 2. Bulk Create Itinerary Items
**POST** `/api/itinerary/bulk`

Create multiple itinerary items at once.

#### Request Body
```json
{
  "trip_id": "64f8a1234567890abcdef123",
  "items": [
    {
      "day_number": 1,
      "activity": "Airport Transfer",
      "start_time": "08:00",
      "category": "transport",
      "cost": 30
    },
    {
      "day_number": 1,
      "activity": "Hotel Check-in",
      "start_time": "14:00",
      "category": "accommodation"
    }
  ]
}
```

#### Response (201)
```json
{
  "success": true,
  "message": "2 itinerary items created successfully",
  "items": [...]
}
```

---

### 3. Get Trip Itinerary
**GET** `/api/itinerary/trip/:trip_id`

Retrieve all itinerary items for a specific trip.

#### Path Parameters
- `trip_id`: Trip ID

#### Query Parameters (Optional)
- `day`: Filter by day number
- `category`: Filter by category
- `completed`: Filter by completion status (`true`/`false`)

#### Example Request
```
GET /api/itinerary/trip/64f8a1234567890abcdef123?day=1&category=sightseeing
```

#### Response (200)
```json
{
  "success": true,
  "trip": {
    "trip_id": "64f8a1234567890abcdef123",
    "destination": "Paris, France",
    "start_date": "2024-06-15T00:00:00.000Z",
    "end_date": "2024-06-22T00:00:00.000Z",
    "duration_days": 8
  },
  "itinerary": {
    "1": [
      {
        "itinerary_id": "64f8a1234567890abcdef789",
        "activity": "Visit Eiffel Tower",
        "start_time": "09:00",
        ...
      }
    ],
    "2": [...],
    "3": [...]
  },
  "total_items": 15
}
```

---

### 4. Get Trip Itinerary Summary
**GET** `/api/itinerary/trip/:trip_id/summary`

Get a summary of the trip's itinerary with statistics.

#### Response (200)
```json
{
  "success": true,
  "trip": {
    "trip_id": "64f8a1234567890abcdef123",
    "destination": "Paris, France",
    "start_date": "2024-06-15T00:00:00.000Z",
    "end_date": "2024-06-22T00:00:00.000Z",
    "duration_days": 8
  },
  "summary": {
    "daily_breakdown": [
      {
        "day_number": 1,
        "activities_count": 5,
        "total_cost": 125.50,
        "completed_count": 3,
        "completion_percentage": 60,
        "activities": [...]
      }
    ],
    "overall_stats": {
      "total_activities": 25,
      "total_cost": 1250.75,
      "completed_activities": 15,
      "completion_percentage": 60
    },
    "category_breakdown": [
      {
        "_id": "sightseeing",
        "count": 8,
        "total_cost": 450.00,
        "completed": 5
      }
    ]
  }
}
```

---

### 5. Get Itinerary Item by ID
**GET** `/api/itinerary/:id`

Retrieve a specific itinerary item.

#### Response (200)
```json
{
  "success": true,
  "itinerary": {
    "itinerary_id": "64f8a1234567890abcdef789",
    "trip_id": "64f8a1234567890abcdef123",
    "activity": "Visit Eiffel Tower",
    ...
  }
}
```

---

### 6. Update Itinerary Item
**PUT** `/api/itinerary/:id`

Update an existing itinerary item.

#### Request Body
```json
{
  "activity": "Visit Eiffel Tower - Updated",
  "start_time": "10:00",
  "end_time": "12:00",
  "cost": 30.00,
  "is_completed": true
}
```

#### Response (200)
```json
{
  "success": true,
  "message": "Itinerary item updated successfully",
  "itinerary": {
    "itinerary_id": "64f8a1234567890abcdef789",
    "activity": "Visit Eiffel Tower - Updated",
    "start_time": "10:00",
    "end_time": "12:00",
    "cost": 30,
    "is_completed": true,
    ...
  }
}
```

---

### 7. Delete Itinerary Item
**DELETE** `/api/itinerary/:id`

Delete an itinerary item.

#### Response (200)
```json
{
  "success": true,
  "message": "Itinerary item deleted successfully"
}
```

---

### 8. Reorder Itinerary Items
**PUT** `/api/itinerary/trip/:trip_id/reorder`

Reorder activities within a specific day.

#### Request Body
```json
{
  "day_number": 1,
  "items": [
    "64f8a1234567890abcdef789",
    "64f8a1234567890abcdef790",
    "64f8a1234567890abcdef791"
  ]
}
```

#### Response (200)
```json
{
  "success": true,
  "message": "Itinerary items reordered successfully",
  "updated_items": [...]
}
```

---

### 9. Toggle Completion Status
**PATCH** `/api/itinerary/:id/toggle-completion`

Toggle the completion status of an itinerary item.

#### Response (200)
```json
{
  "success": true,
  "message": "Itinerary item marked as completed",
  "itinerary": {
    "itinerary_id": "64f8a1234567890abcdef789",
    "is_completed": true,
    ...
  }
}
```

## Validation Rules

### Time Validation
- Times must be in HH:MM format (24-hour)
- End time must be after start time (same day)
- Overnight activities are supported

### Field Validation
- `activity`: Required, max 500 characters, trimmed
- `description`: Optional, max 1000 characters, trimmed
- `location`: Optional, max 255 characters, trimmed  
- `cost`: Must be >= 0 if provided
- `day_number`: Must be within trip duration
- `priority`: Must be 'low', 'medium', or 'high'
- `category`: Must be one of the predefined categories
- `notes`: Optional, max 1000 characters, trimmed

## Error Handling

### Common Error Codes
- **400**: Bad Request (validation errors, invalid data)
- **401**: Unauthorized (missing or invalid token)
- **403**: Forbidden (not authorized to access this itinerary item)
- **404**: Not Found (itinerary item or trip not found)
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
// Create an itinerary item
const createItineraryItem = async (itemData) => {
  const response = await fetch('/api/itinerary', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(itemData)
  });
  return response.json();
};

// Get trip itinerary
const getTripItinerary = async (tripId, filters = {}) => {
  const queryParams = new URLSearchParams(filters);
  const response = await fetch(`/api/itinerary/trip/${tripId}?${queryParams}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};

// Toggle completion status
const toggleCompletion = async (itemId) => {
  const response = await fetch(`/api/itinerary/${itemId}/toggle-completion`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
```

## Security Notes

1. **Authentication Required**: All endpoints require a valid JWT token
2. **Trip Access Control**: Users can only access itinerary items for their own trips
3. **Input Validation**: All inputs are validated and sanitized
4. **Rate Limiting**: Consider implementing rate limiting for bulk operations
5. **Data Privacy**: Itinerary items are private to the trip owner

## Database Indexes

The following indexes are created for optimal performance:
- `{ trip_id: 1, day_number: 1, order_index: 1 }` - For day-specific queries with ordering
- `{ trip_id: 1, category: 1 }` - For category filtering
- `{ trip_id: 1, is_completed: 1 }` - For completion status filtering
