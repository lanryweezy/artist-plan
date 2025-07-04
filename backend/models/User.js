const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    // Basic email validation
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  photoURL: {
    type: String,
  },
  provider: {
    type: String,
    enum: ['google', 'apple', 'email'], // Added 'email' for password-based auth
    required: true,
    default: 'email',
  },
  password: {
    type: String,
    // Required only if provider is 'email'
    required: function() { return this.provider === 'email'; },
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false, // Do not send password hash by default
  },
  passwordConfirm: { // Only used for validation, not saved to DB
    type: String,
    required: function() { return this.provider === 'email' && this.isNew; }, // Required on new user creation with email
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Add other fields as needed, e.g., roles, preferences
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified (or is new)
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

// Instance method to check password (for login)
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
