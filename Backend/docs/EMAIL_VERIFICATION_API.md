# Email Verification API Documentation

## Overview
This API implements email verification for user registration. Users must verify their email address before they can login to the system.

## Flow Description
1. **User Registration**: User submits registration form
2. **Verification Email Sent**: System sends verification email with unique token
3. **Email Verification**: User clicks verification link in email
4. **Account Activated**: User account is verified and welcome email is sent
5. **Login Allowed**: User can now login to the system

## API Endpoints

### 1. User Registration
**Endpoint**: `POST /api/users/register`

**Description**: Registers a new user and sends verification email

**Request Body**:
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "number": "1234567890",
    "password": "securepassword123",
    "google_id": null,
    "profile_pic_url": ""
}
```

**Success Response** (201):
```json
{
    "message": "User registered successfully. Please check your email to verify your account.",
    "user": {
        "_id": "60f7b1b9e1b9c20015a1b1a1",
        "name": "John Doe",
        "email": "john@example.com",
        "number": "1234567890",
        "is_verified": false,
        "createdAt": "2023-07-21T10:30:00.000Z",
        "updatedAt": "2023-07-21T10:30:00.000Z"
    },
    "emailSent": true,
    "verificationRequired": true
}
```

**Error Responses**:
- 400: Missing required fields or user already exists
- 500: Server error

### 2. Email Verification
**Endpoint**: `GET /api/users/verify-email?token={verification_token}`

**Description**: Verifies user email using the token sent via email

**Parameters**:
- `token` (query parameter): Verification token from email

**Success Response** (200): 
- Serves HTML success page with redirect to login
- Sends welcome email to user
- Updates user status to verified

**Error Response** (400):
- Serves HTML error page for invalid/expired tokens

### 3. User Login
**Endpoint**: `POST /api/users/login`

**Description**: Authenticates user (requires email verification)

**Request Body**:
```json
{
    "email": "john@example.com",
    "password": "securepassword123"
}
```

**Success Response** (200):
```json
{
    "message": "Login successful",
    "token": "jwt_token_here",
    "user": {
        "_id": "60f7b1b9e1b9c20015a1b1a1",
        "name": "John Doe",
        "email": "john@example.com",
        "is_verified": true
    }
}
```

**Error Responses**:
- 400: Invalid credentials or email not verified
```json
{
    "message": "Please verify your email before logging in. Check your email for verification link.",
    "emailVerificationRequired": true
}
```

### 4. Resend Verification Email
**Endpoint**: `POST /api/users/resend-verification`

**Description**: Resends verification email to user

**Request Body**:
```json
{
    "email": "john@example.com"
}
```

**Success Response** (200):
```json
{
    "message": "Verification email sent successfully. Please check your email.",
    "emailSent": true
}
```

**Error Responses**:
- 400: User not found or already verified
- 500: Failed to send email

## Email Templates

### Verification Email
- **Subject**: "📧 Please verify your email address - Itinify"
- **Content**: HTML email with verification button/link
- **Token Expiry**: 24 hours
- **Verification Link**: `{FRONTEND_URL}/verify-email?token={verification_token}`

### Welcome Email
- **Subject**: "🎉 Welcome to Itinify - Registration Successful!"
- **Content**: HTML welcome email sent after successful verification
- **Timing**: Sent immediately after email verification

## Database Schema Updates

### User Model Fields Added:
```javascript
{
    is_verified: {
        type: Boolean,
        default: false
    },
    verification_token: {
        type: String,
        default: null
    },
    verification_token_expires: {
        type: Date,
        default: null
    }
}
```

## Environment Variables Required

```env
# Email Configuration
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_app_password

# Frontend URL for verification links
FRONTEND_URL=http://localhost:5173

# JWT Secret
JWT_SECRET=your_jwt_secret_key
```

## Testing

### Manual Testing Steps:
1. Register a new user via POST `/api/users/register`
2. Check email inbox for verification email
3. Click verification link in email
4. Verify redirect to login page
5. Login with verified credentials

### Automated Testing:
Run the test file:
```bash
node test-email-verification.js
```

## Security Features
- **Token Expiry**: Verification tokens expire after 24 hours
- **Unique Tokens**: Each verification request generates a new token
- **Secure Token Generation**: Uses crypto.randomBytes() for token generation
- **Login Protection**: Unverified users cannot login

## Error Handling
- Graceful email service failures (registration still succeeds)
- HTML error pages for verification failures
- Detailed error messages for API consumers
- Proper HTTP status codes

## Frontend Integration

### Verification Page Handling
The verification endpoint serves HTML pages that automatically redirect to your frontend:
- **Success**: Redirects to `/login` after 5 seconds
- **Failure**: Provides options to resend verification or go home

### Recommended Frontend Flow
1. **Registration Page**: Show success message after registration
2. **Login Page**: Handle `emailVerificationRequired` error
3. **Verification Pages**: Handle success/failure redirects
4. **Resend Verification**: Provide UI for resending emails

## Production Considerations
- Set up proper SMTP service (not Gmail for production)
- Configure proper FRONTEND_URL for production environment
- Implement rate limiting for verification emails
- Monitor email delivery rates
- Set up email bounce handling