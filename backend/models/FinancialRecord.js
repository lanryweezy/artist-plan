const mongoose = require('mongoose');

const financialRecordSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Description is required.'],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required.'],
  },
  type: {
    type: String,
    enum: ['Income', 'Expense'],
    required: [true, 'Record type (Income/Expense) is required.'],
  },
  date: {
    type: Date,
    required: [true, 'Date is required.'],
    default: Date.now,
  },
  category: {
    type: String,
    trim: true,
    // Consider a predefined list of categories or allow user-defined ones
    // enum: ['Music Production', 'Marketing', 'Travel', 'Merchandise Sales', 'Streaming Royalties', 'Other']
  },
  budgetId: { // Optional: link to a specific budget
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Budget',
  },
  projectId: { // Optional: link to a specific project
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  },
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
  timestamps: true, // createdAt, updatedAt
});

financialRecordSchema.index({ createdBy: 1, date: -1 });
financialRecordSchema.index({ createdBy: 1, type: 1 });
financialRecordSchema.index({ createdBy: 1, category: 1 });
financialRecordSchema.index({ createdBy: 1, budgetId: 1 });
financialRecordSchema.index({ createdBy: 1, projectId: 1 });


const FinancialRecord = mongoose.model('FinancialRecord', financialRecordSchema);

module.exports = FinancialRecord;
