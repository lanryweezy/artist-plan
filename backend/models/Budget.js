const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Budget name is required.'],
    trim: true,
  },
  amount: { // Target budget amount
    type: Number,
    required: [true, 'Budget amount is required.'],
    min: [0, 'Budget amount cannot be negative.'],
  },
  // spentAmount will be calculated dynamically by querying FinancialRecords linked to this budget
  period: {
    type: String,
    enum: ['Monthly', 'Quarterly', 'Annually', 'Project-Based', 'One-Time', 'Custom'],
    required: [true, 'Budget period is required.'],
  },
  startDate: { // Relevant for recurring or fixed-term budgets
    type: Date,
    // required: function() { return this.period !== 'One-Time' && this.period !== 'Project-Based'; }
  },
  endDate: { // Relevant for recurring or fixed-term budgets
    type: Date,
    // validate: [
    //   function(value) {
    //     // Ensure endDate is after startDate if both are provided
    //     return !this.startDate || !value || value > this.startDate;
    //   },
    //   'End date must be after start date.'
    // ]
  },
  projectId: { // Optional: link to a specific project if it's a project-based budget
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  },
  categories: [{ // Optional: specific expense categories this budget covers
    type: String,
    trim: true,
  }],
  notes: {
    type: String,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
  toObject: { virtuals: true }, // Ensure virtuals are included when converting to an object
  toJSON: { virtuals: true }    // Ensure virtuals are included when converting to JSON
});

budgetSchema.index({ createdBy: 1, name: 1 });
budgetSchema.index({ createdBy: 1, projectId: 1 });

// Virtual property for spentAmount (calculated on the fly when querying)
// This is a placeholder concept. Actual calculation would be done in controller/service layer
// or via aggregation pipeline for performance.
// budgetSchema.virtual('spentAmount', {
//   ref: 'FinancialRecord',
//   localField: '_id',
//   foreignField: 'budgetId',
//   justOne: false,
//   match: { type: 'Expense' }, // Only count expenses towards spent amount
//   count: true // This would give count, need to sum 'amount' for actual spending
// });


const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;
