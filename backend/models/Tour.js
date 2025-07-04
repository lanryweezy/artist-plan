const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour name is required.'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Planning', 'Announced', 'Ongoing', 'Completed', 'Cancelled', 'Postponed'],
    default: 'Planning',
  },
  startDate: { // Approximate start date of the tour
    type: Date,
  },
  endDate: { // Approximate end date of the tour
    type: Date,
    validate: [
      function(value) {
        return !this.startDate || !value || value >= this.startDate;
      },
      'End date must be on or after start date.'
    ]
  },
  region: { // e.g., "North America", "Europe", "UK"
    type: String,
    trim: true,
  },
  // Shows will be linked via Show model's tourId
  // tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }], // For tour-specific tasks
  // budget: { type: mongoose.Schema.Types.ObjectId, ref: 'Budget' }, // Link to a tour budget
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

tourSchema.index({ createdBy: 1, status: 1 });
tourSchema.index({ createdBy: 1, startDate: -1 });

// Virtual to populate shows (can be intensive, consider separate endpoint or selective population)
// tourSchema.virtual('shows', {
//   ref: 'Show',
//   localField: '_id',
//   foreignField: 'tourId'
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
