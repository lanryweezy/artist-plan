const mongoose = require('mongoose');

// Align with CONTENT_ITEM_TYPE_OPTIONS and CONTENT_ITEM_STATUS_OPTIONS from types.ts
const CONTENT_ITEM_TYPE_OPTIONS = [
  'Image', 'Video', 'Audio', 'Document', 'Social Post Snippet', 'Lyrics',
  'Press Release', 'Artwork', 'AI Strategy Document', 'Other'
];

const CONTENT_ITEM_STATUS_OPTIONS = [
  'Draft', 'In Review', 'Approved', 'Scheduled', 'Published', 'Archived'
];

const contentItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Content item title is required.'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    enum: CONTENT_ITEM_TYPE_OPTIONS,
    required: [true, 'Content item type is required.'],
  },
  status: {
    type: String,
    enum: CONTENT_ITEM_STATUS_OPTIONS,
    default: 'Draft',
  },
  tags: [{
    type: String,
    trim: true,
  }],
  // For actual file storage, you'd typically store a URL or path here.
  // The file itself would be uploaded to a service like AWS S3, Cloudinary, or local storage.
  filePathOrUrl: { // This will store the reference to the actual file
    type: String,
    trim: true,
  },
  thumbnailUrl: { // Optional: for video or image previews
    type: String,
    trim: true,
  },
  fileSize: { // e.g., "2.5MB" or numeric in bytes
    type: String, // Or Number (bytes)
  },
  // duration: { // For audio/video, e.g., "3:45" or numeric in seconds
  //   type: String, // Or Number (seconds)
  // },
  associatedProjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
  },
  // platform: { // E.g., 'Instagram', 'TikTok', if it's a social media post snippet
  //   type: String,
  //   trim: true,
  // },
  // publishDate: { // If scheduled or published
  //   type: Date,
  // },
  source: { // How the content was generated or where it came from
    type: String,
    enum: ['Uploaded', 'AI Generated Strategy', 'AI Generated Post', 'Lyrics Editor', 'Other'],
    default: 'Uploaded',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true, // createdAt, updatedAt
});

contentItemSchema.index({ createdBy: 1, status: 1 });
contentItemSchema.index({ createdBy: 1, type: 1 });
contentItemSchema.index({ createdBy: 1, tags: 1 });
contentItemSchema.index({ associatedProjectId: 1 });
contentItemSchema.index({ campaignId: 1 });

const ContentItem = mongoose.model('ContentItem', contentItemSchema);

module.exports = ContentItem;
