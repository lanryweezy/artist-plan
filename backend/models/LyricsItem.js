const mongoose = require('mongoose');

// Align with LYRICS_ITEM_STATUS_OPTIONS from types.ts
const LYRICS_ITEM_STATUS_OPTIONS = ['Idea', 'Draft', 'In Progress', 'Completed', 'Archived'];

const lyricsItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lyrics title is required.'],
    trim: true,
  },
  lyricsText: { // The actual lyrics content
    type: String,
    required: [true, 'Lyrics text is required.'],
  },
  notes: { // Songwriting notes, chords, structure ideas etc.
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: LYRICS_ITEM_STATUS_OPTIONS,
    default: 'Idea',
  },
  tags: [{
    type: String,
    trim: true,
  }],
  // Optional: Link to a project (e.g., if these lyrics are for a song in an album project)
  associatedProjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  },
  // Optional: Could link to an audio ContentItem if a demo exists
  // associatedDemoId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'ContentItem',
  // },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true, // createdAt, updatedAt
});

lyricsItemSchema.index({ createdBy: 1, status: 1 });
lyricsItemSchema.index({ createdBy: 1, title: 1 });
lyricsItemSchema.index({ associatedProjectId: 1 });

const LyricsItem = mongoose.model('LyricsItem', lyricsItemSchema);

module.exports = LyricsItem;
