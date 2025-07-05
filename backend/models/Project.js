const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required.'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['New', 'Idea', 'Planning', 'In Progress', 'On Hold', 'Completed', 'Archived'],
    default: 'New',
  },
  projectType: {
    type: String,
    // Consider referencing projectTypeOptions from your frontend types.ts for consistency,
    // or define a comprehensive list here.
    // For now, keeping it flexible as a string.
    // enum: ['Album Release', 'EP Release', ...etc ]
    trim: true,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  dueDate: { // Overall project due date
    type: Date,
  },
  // Tasks will be linked via Task model's projectId, so no direct array of Task IDs here
  // unless you want to duplicate for quick reference (generally not recommended for consistency).
  milestones: [{
    title: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed', 'Delayed'],
      default: 'Pending',
    },
    description: String,
  }],
  budget: { // Estimated budget
    type: Number,
    min: 0,
  },
  actualCost: { // Tracked cost
    type: Number,
    min: 0,
  },
  resources: [{ // Could be links to documents, contacts, etc.
    name: String,
    link: String,
    type: String, // e.g., 'document', 'contact', 'link'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // collaborators: [{ // Future enhancement: allow multiple users to collaborate
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  // }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true // Automatically manages createdAt and updatedAt
});

// Middleware to update `updatedAt` on save (redundant if timestamps: true is used, but explicit)
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for frequently queried fields
projectSchema.index({ createdBy: 1, status: 1 });
projectSchema.index({ dueDate: 1 });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
