const nodemailer = require('nodemailer');

// Create transporter with better error handling
const createTransporter = () => {
  console.log('Creating email transporter...');
  console.log('SMTP_USER:', process.env.SMTP_USER);
  console.log('SMTP_PASS is set:', !!process.env.SMTP_PASS);
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    debug: true, // Enable debug mode
    logger: true // Enable logging
  });
};

// Send welcome email after successful registration
const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    console.log(`Attempting to send welcome email to: ${userEmail}`);
    
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('Email configuration missing: SMTP_USER or SMTP_PASS not set');
    }
    
    const transporter = createTransporter();
    
    // Verify transporter configuration
    console.log('Verifying transporter...');
    await transporter.verify();
    console.log('Transporter verified successfully');

    const mailOptions = {
      from: {
        name: 'Itinify Team',
        address: process.env.SMTP_USER,
      },
      to: userEmail,
      subject: '🎉 Welcome to Itinify - Registration Successful!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Itinify</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .welcome-msg {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 20px;
              color: #667eea;
            }
            .info-box {
              background: white;
              padding: 20px;
              border-radius: 8px;
              border-left: 4px solid #667eea;
              margin: 20px 0;
            }
            .button {
              display: inline-block;
              background: #667eea;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎉 Welcome to Itinify!</h1>
            <p>Your account has been created successfully</p>
          </div>
          
          <div class="content">
            <div class="welcome-msg">Hello ${userName}!</div>
            
            <p>Thank you for joining Itinify! We're excited to have you on board.</p>
            
            <div class="info-box">
              <h3>🚀 What's Next?</h3>
              <ul>
                <li>Complete your profile setup</li>
                <li>Explore our amazing features</li>
                <li>Start planning your next adventure</li>
              </ul>
            </div>
            
            <p>Your account details:</p>
            <ul>
              <li><strong>Email:</strong> ${userEmail}</li>
              <li><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</li>
            </ul>
            
            <div style="text-align: center;">
              <a href="#" class="button">Get Started</a>
            </div>
            
            <div class="info-box">
              <h3>📞 Need Help?</h3>
              <p>If you have any questions or need assistance, don't hesitate to reach out to our support team.</p>
              <p><strong>Email:</strong> support@itinify.com</p>
            </div>
          </div>
          
          <div class="footer">
            <p>&copy; 2025 Itinify. All rights reserved.</p>
            <p>This email was sent because you registered for an Itinify account.</p>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to Itinify!
        
        Hello ${userName}!
        
        Thank you for joining Itinify! We're excited to have you on board.
        
        Your account details:
        - Email: ${userEmail}
        - Registration Date: ${new Date().toLocaleDateString()}
        
        What's Next?
        - Complete your profile setup
        - Explore our amazing features
        - Start planning your next adventure
        
        Need Help?
        If you have any questions or need assistance, don't hesitate to reach out to our support team at support@itinify.com
        
        © 2025 Itinify. All rights reserved.
      `,
    };

    console.log('Sending email...');
    const result = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully! MessageId:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error.message);
    console.error('Full error:', error);
    return { success: false, error: error.message };
  }
};

// Send email verification (for future use)
const sendVerificationEmail = async (userEmail, userName, verificationToken) => {
  try {
    const transporter = createTransporter();
    const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: {
        name: 'Itinify Team',
        address: process.env.SMTP_USER,
      },
      to: userEmail,
      subject: '📧 Please verify your email address - Itinify',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #667eea; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .button { background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📧 Verify Your Email</h1>
            </div>
            <div class="content">
              <h2>Hello ${userName}!</h2>
              <p>Please click the button below to verify your email address:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationLink}" class="button">Verify Email Address</a>
              </div>
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #667eea;">${verificationLink}</p>
              <p><strong>Note:</strong> This link will expire in 24 hours.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendWelcomeEmail,
  sendVerificationEmail,
};
