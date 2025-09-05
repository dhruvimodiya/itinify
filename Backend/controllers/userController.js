const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const { sendWelcomeEmail, sendVerificationEmail } = require('../utils/emailService');

const registerUser = async (req, res) => {
  try {
    // Debug: Log the request body
    console.log('Register request body:', req.body);
    
    // Validate request body exists
    if (!req.body) {
      return res.status(400).json({ message: "Request body is missing" });
    }

    const { name, email, number, password, google_id, profile_pic_url } = req.body;   
    
    // Validate required fields
    if (!name || !email || !number || !password) {
      return res.status(400).json({ 
        message: "Name, email, number, and password are required",
        received: { 
          name: !!name, 
          email: !!email, 
          number: !!number, 
          password: !!password 
        }
      });
    }

    // Check if user with the same email or number already exists
    const existingUser = await User.findOne({
        $or: [{ email }, { number }]
    });
    if (existingUser) {
        return res.status(400).json({ message: 'User with this email or number already exists' });
    }

        // hash the password 
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        const newUser = new User({
            name,
            email,
            number,
            password_hash: hashedPassword,
            google_id,
            profile_pic_url,
            is_verified: false,
            verification_token: verificationToken,
            verification_token_expires: verificationTokenExpires
        });
        await newUser.save();

        // Send verification email
        console.log('Sending verification email to:', email);
        const emailResult = await sendVerificationEmail(email, name, verificationToken);
        
        if (emailResult.success) {
            console.log('Verification email sent successfully');
        } else {
            console.error('Failed to send verification email:', emailResult.error);
            // Note: We don't fail the registration if email fails
        }

        // Remove password from response
        const userResponse = {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            number: newUser.number,
            google_id: newUser.google_id,
            profile_pic_url: newUser.profile_pic_url,
            is_verified: newUser.is_verified,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt
        };

        res.status(201).json({ 
            message: 'User registered successfully. Please check your email to verify your account.', 
            user: userResponse,
            emailSent: emailResult.success,
            verificationRequired: true
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const loginUser = async (req, res) => {
  try {
    // Debug: Log the request body
    console.log('Request body:', req.body);
    console.log('Content-Type:', req.get('Content-Type'));
    
    // Validate request body exists
    if (!req.body) {
      return res.status(400).json({ message: "Request body is missing" });
    }

    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email and password are required",
        received: { email: !!email, password: !!password }
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if user is verified
    if (!existingUser.is_verified) {
      return res.status(400).json({ 
        message: "Please verify your email before logging in. Check your email for verification link.",
        emailVerificationRequired: true
      });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, existingUser.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: existingUser,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Email verification function
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    
    if (!token) {
      // Serve verification failed page
      const failedPagePath = path.join(__dirname, '../views/verification-failed.html');
      let html = fs.readFileSync(failedPagePath, 'utf8');
      // Replace environment variables in HTML
      html = html.replace(/process\.env\.FRONTEND_URL/g, `"${process.env.FRONTEND_URL || 'http://localhost:5173'}"`);
      return res.status(400).send(html);
    }

    // Find user with this verification token
    const user = await User.findOne({
      verification_token: token,
      verification_token_expires: { $gt: new Date() }
    });

    if (!user) {
      // Serve verification failed page
      const failedPagePath = path.join(__dirname, '../views/verification-failed.html');
      let html = fs.readFileSync(failedPagePath, 'utf8');
      // Replace environment variables in HTML
      html = html.replace(/process\.env\.FRONTEND_URL/g, `"${process.env.FRONTEND_URL || 'http://localhost:5173'}"`);
      return res.status(400).send(html);
    }

    // Update user as verified
    user.is_verified = true;
    user.verification_token = null;
    user.verification_token_expires = null;
    await user.save();

    // Send welcome email after successful verification
    console.log('Sending welcome email to:', user.email);
    const emailResult = await sendWelcomeEmail(user.email, user.name);
    
    if (emailResult.success) {
      console.log('Welcome email sent successfully');
    } else {
      console.error('Failed to send welcome email:', emailResult.error);
    }

    // Serve verification success page
    const successPagePath = path.join(__dirname, '../views/verification-success.html');
    let html = fs.readFileSync(successPagePath, 'utf8');
    // Replace environment variables in HTML
    html = html.replace(/process\.env\.FRONTEND_URL/g, `"${process.env.FRONTEND_URL || 'http://localhost:5173'}"`);
    res.status(200).send(html);
    
  } catch (error) {
    console.error("Error verifying email:", error);
    // Serve verification failed page
    const failedPagePath = path.join(__dirname, '../views/verification-failed.html');
    let html = fs.readFileSync(failedPagePath, 'utf8');
    // Replace environment variables in HTML
    html = html.replace(/process\.env\.FRONTEND_URL/g, `"${process.env.FRONTEND_URL || 'http://localhost:5173'}"`);
    res.status(500).send(html);
  }
};

// Resend verification email
const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if already verified
    if (user.is_verified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    user.verification_token = verificationToken;
    user.verification_token_expires = verificationTokenExpires;
    await user.save();

    // Send verification email
    console.log('Resending verification email to:', email);
    const emailResult = await sendVerificationEmail(email, user.name, verificationToken);
    
    if (emailResult.success) {
      res.status(200).json({ 
        message: 'Verification email sent successfully. Please check your email.',
        emailSent: true
      });
    } else {
      res.status(500).json({ 
        message: 'Failed to send verification email. Please try again.',
        emailSent: false,
        error: emailResult.error
      });
    }
  } catch (error) {
    console.error("Error resending verification email:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Google OAuth login/register
const googleAuth = async (req, res) => {
  try {
    // User is already authenticated by passport middleware
    const user = req.user;

    if (!user) {
      return res.status(400).json({ message: 'Authentication failed' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Check if user needs to complete profile
    const needsPhoneNumber = !user.number || user.number === '';

    res.json({
      message: 'Google authentication successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        number: user.number,
        profile_pic_url: user.profile_pic_url,
        is_verified: user.is_verified,
        google_id: user.google_id
      },
      needsPhoneNumber
    });

  } catch (error) {
    console.error('Error in Google auth:', error);
    res.status(500).json({ message: 'Server error during Google authentication' });
  }
};

module.exports = { registerUser, loginUser, verifyEmail, resendVerificationEmail, googleAuth };

