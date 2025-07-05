const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Correct path to User model
const { promisify } = require('util'); // For promisifying jwt.verify

// Helper function to sign JWT
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d', // Default to 90 days
  });
};

// Helper function to create and send token
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm, provider, photoURL } = req.body;

    if (provider && provider !== 'email') {
      // Handle OAuth signup (simplified: assumes user data is pre-verified by frontend)
      let user = await User.findOne({ email, provider });
      if (!user) {
        user = await User.create({
          name,
          email,
          provider,
          photoURL,
          // No password for OAuth users
        });
      }
      return createSendToken(user, 201, res);
    }

    // Email/Password Signup
    if (!password || !passwordConfirm) {
        return res.status(400).json({ status: 'fail', message: 'Please provide password and password confirmation.' });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
      provider: 'email', // Explicitly set provider
      photoURL,
    });

    createSendToken(newUser, 201, res);
  } catch (error) {
    // Handle errors (e.g., duplicate email)
    res.status(400).json({
      status: 'fail',
      message: error.message || 'Error creating user.',
      errors: error.errors // Mongoose validation errors
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, provider, idToken } = req.body; // idToken for OAuth

    if (provider && provider !== 'email') {
        // Handle OAuth login (very simplified for now)
        // In a real app, you'd verify idToken with Google/Apple here
        const user = await User.findOne({ email, provider });
        if (!user) {
            return res.status(401).json({ status: 'fail', message: 'User not found with this OAuth provider.' });
        }
        return createSendToken(user, 200, res);
    }

    // Email/Password Login
    if (!email || !password) {
      return res.status(400).json({ status: 'fail', message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email, provider: 'email' }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ status: 'fail', message: 'Incorrect email or password.' });
    }

    createSendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'An error occurred during login.',
    });
  }
};

// Middleware to protect routes
exports.protect = async (req, res, next) => {
  try {
    let token;
    // 1) Getting token and check if it's there
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ status: 'unauthorized', message: 'You are not logged in! Please log in to get access.'});
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({ status: 'unauthorized', message: 'The user belonging to this token does no longer exist.'});
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (error) {
     res.status(401).json({ status: 'unauthorized', message: 'Invalid token or session expired.'});
  }
};
