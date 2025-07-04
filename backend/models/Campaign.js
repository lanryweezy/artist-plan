const mongoose = require('mongoose');

// Re-using CAMPAIGN_TYPE_OPTIONS and CAMPAIGN_STATUS_OPTIONS from your types.ts for consistency
// For a backend model, it's often good to define them here or import if shareable,
// but for now, I'll list common ones. Ensure these align with your frontend.
const CAMPAIGN_TYPE_OPTIONS = [
  'Album Release', 'Single Launch', 'Music Video Promo', 'Tour Promotion',
  'Merchandise Launch', 'Brand Awareness', 'Fan Engagement', 'Other'
];

const CAMPAIGN_STATUS_OPTIONS = [
  'Draft', 'Planning', 'Active', 'Completed', 'On Hold', 'Archived'
];

const campaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Campaign name is required.'],
    trim: true,
  },
  campaignType: {
    type: String,
    enum: CAMPAIGN_TYPE_OPTIONS,
    required: [true, 'Campaign type is required.'],
  },
  status: {
    type: String,
    enum: CAMPAIGN_STATUS_OPTIONS,
    default: 'Draft',
  },
  description: {
    type: String,
    trim: true,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
    validate: [
      function(value) {
        return !this.startDate || !value || value >= this.startDate;
      },
      'End date must be on or after start date.'
    ]
  },
  targetAudience: {
    type: String,
    trim: true,
  },
  keyObjectives: [{ // Array of strings for multiple objectives
    type: String,
    trim: true,
  }],
  budget: { // Can be a string like "$500 - $1000" or a more structured object if preferred
    type: String, // Or Number if you enforce numeric only
    trim: true,
  },
  channels: [{ // Marketing channels used, e.g., ['Instagram', 'TikTok', 'Email']
    type: String,
    trim: true,
  }],
  linkedProjectId: { // Optional: ID of a project from ProjectManagement
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  },
  // aiGeneratedContent: [{ // Store AI generated ideas or content snippets for the campaign
  //   tool: String, // e.g., 'social_media_post_generator', 'ad_copy_writer'
  //   prompt: String,
  //   output: String,
  //   timestamp: { type: Date, default: Date.now }
  // }],
  performanceMetrics: [{ // Simple way to track key metrics
      name: String, // e.g., 'Reach', 'Engagement Rate', 'Conversions'
      value: String, // e.g., '10000', '5%', '200 sales'
      notes: String,
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true, // createdAt, updatedAt
});

campaignSchema.index({ createdBy: 1, status: 1 });
campaignSchema.index({ createdBy: 1, campaignType: 1 });
campaignSchema.index({ createdBy: 1, endDate: -1 });
campaignSchema.index({ linkedProjectId: 1 });


const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;
