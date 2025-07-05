const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
  tourId: { // Link to the parent tour
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    // required: true, // A show usually belongs to a tour, but could be standalone
  },
  date: {
    type: Date,
    required: [true, 'Show date is required.'],
  },
  venueName: {
    type: String,
    required: [true, 'Venue name is required.'],
    trim: true,
  },
  city: {
    type: String,
    required: [true, 'City is required.'],
    trim: true,
  },
  country: { // Or state/province depending on detail needed
    type: String,
    required: [true, 'Country is required.'],
    trim: true,
  },
  status: { // Status of this specific show
    type: String,
    enum: ['Scheduled', 'Confirmed', 'Cancelled', 'Postponed', 'Completed', 'Sold Out'],
    default: 'Scheduled',
  },
  showTime: { // e.g., "20:00"
    type: String,
    trim: true,
    match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Show time must be in HH:MM format (e.g., 20:00).']
  },
  doorsOpenTime: { // e.g., "19:00"
    type: String,
    trim: true,
    match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Doors open time must be in HH:MM format (e.g., 19:00).']
  },
  ticketLink: {
    type: String,
    trim: true,
  },
  dealTerms: { // e.g., "Guarantee $500 + 80% of door after $200"
    type: String,
    trim: true,
  },
  promoterContact: {
    name: String,
    email: String,
    phone: String,
  },
  venueContact: {
    name: String,
    email: String,
    phone: String,
  },
  notes: { // General notes, setlist ideas, tech requirements for this show
    type: String,
    trim: true,
  },
  // Financials for this specific show (can also be tracked via FinancialRecord linking to showId)
  // guaranteeAmount: Number,
  // actualRevenue: Number,
  // actualExpenses: Number,

  // For linking to general tasks or financial records if needed
  // associatedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  // associatedFinancialRecords: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FinancialRecord' }],

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

showSchema.index({ createdBy: 1, date: 1 });
showSchema.index({ tourId: 1, date: 1 });
showSchema.index({ createdBy: 1, city: 1 });

const Show = mongoose.model('Show', showSchema);

module.exports = Show;
