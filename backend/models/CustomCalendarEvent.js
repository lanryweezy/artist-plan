const mongoose = require('mongoose');

const customCalendarEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required.'],
    trim: true,
  },
  date: { // Start date of the event
    type: Date,
    required: [true, 'Event date is required.'],
  },
  endDate: { // Optional: for multi-day events
    type: Date,
    validate: [
      function(value) {
        return !value || value >= this.date; // endDate must be on or after date
      },
      'End date must be on or after the start date.'
    ]
  },
  startTime: { // e.g., "10:00" (stored as string, consider timezones if app becomes complex)
    type: String,
    trim: true,
    match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Start time must be in HH:MM format (e.g., 10:30).']
  },
  endTime: { // e.g., "11:30"
    type: String,
    trim: true,
    match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'End time must be in HH:MM format (e.g., 11:45).'],
    validate: [
        function(value) {
            if (!this.startTime || !value) return true; // If no startTime or no endTime, validation passes
            // Compare time strings only if both are present and valid
            if (/^([01]\d|2[0-3]):([0-5]\d)$/.test(this.startTime) && /^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
                 // If it's a single day event (or endDate is same as date)
                if (!this.endDate || this.date.getTime() === this.endDate.getTime()) {
                    return value > this.startTime;
                }
            }
            return true; // Pass if different days or invalid time format (handled by match)
        },
        'End time must be after start time on the same day.'
    ]
  },
  description: {
    type: String,
    trim: true,
  },
  color: { // User-chosen color for the event display (hex code or name)
    type: String,
    trim: true,
    default: '#3788d8', // A default blue, similar to FullCalendar's default
  },
  // type: { // Could be 'Personal', 'Reminder', 'Meeting', etc. - from your types CalendarEventType
  //   type: String,
  //   default: 'custom_event' // Differentiating from tasks, project_due etc.
  // },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

customCalendarEventSchema.index({ createdBy: 1, date: 1 });

const CustomCalendarEvent = mongoose.model('CustomCalendarEvent', customCalendarEventSchema);

module.exports = CustomCalendarEvent;
