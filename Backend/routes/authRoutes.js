const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// @route   GET /api/auth/google
// @desc    Start Google OAuth flow
// @access  Public
router.get('/google', 
    passport.authenticate('google', { 
        scope: ['profile', 'email'] 
    })
);

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get('/google/callback', 
    passport.authenticate('google', { 
        failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`,
        session: false 
    }),
    async (req, res) => {
        try {
            // Generate JWT token for the authenticated user
            const token = jwt.sign(
                { id: req.user._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            // Check if user needs to complete profile (e.g., phone number)
            const needsPhoneNumber = !req.user.number || req.user.number === '';

            // Redirect to frontend with token and user info
            const redirectUrl = needsPhoneNumber 
                ? `${process.env.CLIENT_URL}/complete-profile?token=${token}&needs_phone=true`
                : `${process.env.CLIENT_URL}/dashboard?token=${token}`;

            res.redirect(redirectUrl);

        } catch (error) {
            console.error('Error in Google callback:', error);
            res.redirect(`${process.env.CLIENT_URL}/login?error=server_error`);
        }
    }
);

// @route   POST /api/auth/complete-profile
// @desc    Complete user profile after Google OAuth (add phone number)
// @access  Protected
router.post('/complete-profile', async (req, res) => {
    try {
        const { phone_number } = req.body;
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        if (!phone_number) {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Check if phone number is already in use
        const existingUser = await User.findOne({ 
            number: phone_number, 
            _id: { $ne: userId } 
        });

        if (existingUser) {
            return res.status(400).json({ 
                message: 'Phone number is already registered' 
            });
        }

        // Update user with phone number
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { number: phone_number },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'Profile completed successfully',
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                number: updatedUser.number,
                profile_pic_url: updatedUser.profile_pic_url,
                is_verified: updatedUser.is_verified
            }
        });

    } catch (error) {
        console.error('Error completing profile:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
