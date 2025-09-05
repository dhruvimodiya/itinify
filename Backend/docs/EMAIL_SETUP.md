# Email Configuration Guide for Itinify

## Gmail Setup Instructions

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Under "Signing in to Google", click on "2-Step Verification"
4. Follow the steps to enable 2FA if not already enabled

### Step 2: Generate App Password
1. Still in the "Security" section, look for "App passwords"
2. Click on "App passwords" (you might need to re-authenticate)
3. Select "Mail" from the dropdown
4. Select "Other (Custom name)" and enter "Itinify Backend"
5. Click "Generate"
6. Copy the generated 16-character password (it will look like: `abcd efgh ijkl mnop`)

### Step 3: Update .env File
Replace the placeholders in your `.env` file:

```env
SMTP_USER=your_actual_email@gmail.com
SMTP_PASS=your_generated_app_password
```

**Example:**
```env
SMTP_USER=john.doe@gmail.com
SMTP_PASS=abcdefghijklmnop
```

### Step 4: Test Email Functionality

#### Option 1: Test with Registration
1. Register a new user through `/api/users/register`
2. Check your console logs for email status
3. Check the recipient's inbox for the welcome email

#### Option 2: Test with Test Endpoint
Send a POST request to `/api/users/test-email` with:
```json
{
  "email": "test@example.com",
  "name": "Test User"
}
```

## Other Email Providers

### Outlook/Hotmail
```javascript
service: 'outlook'
// Use your regular email and password
```

### Yahoo
```javascript
service: 'yahoo'
// Use your regular email and password
```

### Custom SMTP
```javascript
host: 'your-smtp-server.com',
port: 587,
secure: false, // true for 465, false for other ports
```

## Troubleshooting

### Common Issues:
1. **"Invalid login"** - Check if 2FA is enabled and you're using app password
2. **"Connection timeout"** - Check firewall/network settings
3. **"Service unavailable"** - Verify the service name is correct

### Debug Tips:
- Check console logs for detailed error messages
- Verify environment variables are loaded correctly
- Test with a simple email first using the test endpoint

## Security Notes:
- Never commit your actual email credentials to Git
- Use app passwords instead of your main password
- Consider using environment-specific email accounts for development
