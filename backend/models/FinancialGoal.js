const mongoose = require('mongoose');

const financialGoalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Goal name is required.'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  targetAmount: {
    type: Number,
    required: [true, 'Target amount is required.'],
    min: [0.01, 'Target amount must be positive.'],
  },
  currentAmount: { // Amount currently saved or achieved towards the goal
    type: Number,
    default: 0,
    min: [0, 'Current amount cannot be negative.'],
    validate: [
        function(value) {
            // Ensure currentAmount does not exceed targetAmount
            return value <= this.targetAmount;
        },
        'Current amount cannot exceed target amount.'
    ]
  },
  deadline: { // Optional due date to achieve the goal
    type: Date,
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low', 'None'],
    default: 'Medium',
  },
  category: { // e.g., Savings, Investment, Debt Reduction, Project Funding
    type: String,
    trim: true,
  },
  status: { // Calculated or manually set
      type: String,
      enum: ['Not Started', 'In Progress', 'Achieved', 'On Hold'],
      default: 'Not Started',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

// Virtual for progress percentage
financialGoalSchema.virtual('progress').get(function() {
  if (this.targetAmount > 0) {
    return Math.min(Math.round((this.currentAmount / this.targetAmount) * 100), 100);
  }
  return 0;
});

// Update status based on currentAmount and targetAmount before saving
financialGoalSchema.pre('save', function(next) {
    if (this.currentAmount >= this.targetAmount) {
        this.status = 'Achieved';
    } else if (this.currentAmount > 0) {
        this.status = 'In Progress';
    } else {
        this.status = 'Not Started';
    }
    // If deadline passed and not achieved, could also set to 'Overdue' or similar
    next();
});


financialGoalSchema.index({ createdBy: 1, status: 1 });
financialGoalSchema.index({ createdBy: 1, deadline: 1 });

const FinancialGoal = mongoose.model('FinancialGoal', financialGoalSchema);

module.exports = FinancialGoal;
