const { User, RefreshToken } = require('../models');
const { 
  hashPassword, 
  comparePassword, 
  generateAccessToken, 
  generateRefreshToken,
  generateRandomToken,
  verifyToken
} = require('../utils/auth');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/email');
const crypto = require('crypto');

// Register user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name, email, and password are required' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'User with this email already exists' 
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = new User({
      name,
      email,
      passwordHash: hashedPassword
    });

    await user.save();

    // In development, auto-verify the user to simplify local testing
    if (process.env.NODE_ENV === 'development') {
      user.verified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();
    } else {
      // Generate email verification token for production
      const verificationToken = generateRandomToken();
      user.emailVerificationToken = verificationToken;
      user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
      await user.save();

      // Send verification email
      try {
        await sendVerificationEmail(user.email, verificationToken);
      } catch (emailError) {
        console.error('Error sending verification email:', emailError);
        // Don't fail the registration if email sending fails
      }
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email to verify your account.'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
};

// Verify email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ 
        success: false, 
        error: 'Verification token is required' 
      });
    }

    // Find user with this token
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid or expired verification token' 
      });
    }

    // Verify user
    user.verified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }

    // Check if email is verified
    if (!user.verified) {
      return res.status(401).json({ 
        success: false, 
        error: 'Please verify your email before logging in' 
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Hash refresh token for storage
    const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

    // Save refresh token
    await RefreshToken.findOneAndUpdate(
      { userId: user._id },
      {
        userId: user._id,
        token: hashedRefreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      },
      { upsert: true, new: true }
    );

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
};

// Refresh token
const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ 
        success: false, 
        error: 'Refresh token is required' 
      });
    }

    // Verify refresh token
    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid refresh token' 
      });
    }

    // Hash refresh token for database lookup
    const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

    // Find refresh token in database
    const storedToken = await RefreshToken.findOne({
      userId: decoded.userId,
      token: hashedRefreshToken,
      expiresAt: { $gt: Date.now() }
    });

    if (!storedToken) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid or expired refresh token' 
      });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(decoded.userId);
    const newRefreshToken = generateRefreshToken(decoded.userId);

    // Hash new refresh token for storage
    const hashedNewRefreshToken = crypto.createHash('sha256').update(newRefreshToken).digest('hex');

    // Update refresh token in database
    storedToken.token = hashedNewRefreshToken;
    storedToken.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    await storedToken.save();

    // Set new refresh token as httpOnly cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(200).json({
      success: true,
      accessToken: newAccessToken
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      // Hash refresh token for database lookup
      const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

      // Delete refresh token from database
      await RefreshToken.findOneAndDelete({
        token: hashedRefreshToken
      });
    }

    // Clear refresh token cookie
    res.clearCookie('refreshToken');

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
};

// Forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email is required' 
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link'
      });
    }

    // Generate reset token
    const resetToken = generateRandomToken();
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    // Send password reset email
    try {
      await sendPasswordResetEmail(user.email, resetToken);
    } catch (emailError) {
      console.error('Error sending password reset email:', emailError);
      // Don't fail the request if email sending fails
    }

    res.status(200).json({
      success: true,
      message: 'If an account exists with this email, you will receive a password reset link'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Token and password are required' 
      });
    }

    // Find user with this token
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid or expired reset token' 
      });
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Update password and clear reset token
    user.passwordHash = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
};

module.exports = {
  register,
  verifyEmail,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword
};