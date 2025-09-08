const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const crypto = require('crypto');
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://localhost:5000/api/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('Google OAuth Profile:', {
            id: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            picture: profile.photos[0].value
        });

        // Check if user already exists with this Google ID
        let existingUser = await User.findOne({ google_id: profile.id });
        
        if (existingUser) {
            console.log('Existing Google user found:', existingUser.email);
            return done(null, existingUser);
        }

        // Check if user exists with the same email (from regular registration)
        existingUser = await User.findOne({ email: profile.emails[0].value });
        
        if (existingUser) {
            // Link Google account to existing user
            console.log('Linking Google account to existing user:', existingUser.email);
            existingUser.google_id = profile.id;
            existingUser.profile_pic_url = profile.photos[0].value;
            existingUser.is_verified = true; // Google accounts are automatically verified
            
            // Generate verification token if not already present
            if (!existingUser.verification_token) {
                existingUser.verification_token = crypto.randomBytes(32).toString('hex');
                existingUser.verification_token_expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
            }
            
            await existingUser.save();
            return done(null, existingUser);
        }

        // Create new user with Google data
        console.log('Creating new Google user:', profile.emails[0].value);
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        
        const newUser = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            google_id: profile.id,
            profile_pic_url: profile.photos[0].value,
            number: '', // Will need to be filled later by user if required
            is_verified: true, // Google accounts are automatically verified
            verification_token: verificationToken,
            verification_token_expires: tokenExpires
        });

        await newUser.save();
        console.log('New Google user created successfully');
        return done(null, newUser);

    } catch (error) {
        console.error('Error in Google OAuth strategy:', error);
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
