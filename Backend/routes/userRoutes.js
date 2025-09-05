const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyEmail, resendVerificationEmail } = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');
const { sendWelcomeEmail } = require('../utils/emailService');

// api/users/register
router.post('/register', registerUser);

// api/users/login
router.post('/login', loginUser);

// api/users/verify-email
router.get('/verify-email', verifyEmail);

// api/users/resend-verification
router.post('/resend-verification', resendVerificationEmail);

// Protected route example - get user profile
router.get('/profile', verifyToken, (req, res) => {
  res.json({
    message: 'Profile data accessed successfully',
    user: req.user
  });
});

// Test email route (for testing purposes)
router.post('/test-email', async (req, res) => {
  try {
    const { email, name } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({ message: 'Email and name are required' });
    }
    
    const result = await sendWelcomeEmail(email, name);
    
    if (result.success) {
      res.json({ message: 'Test email sent successfully', messageId: result.messageId });
    } else {
      res.status(500).json({ message: 'Failed to send test email', error: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;