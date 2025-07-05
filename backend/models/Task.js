const mongoose = require('mongoose');

const subtaskSchema = new mongoose.Schema({
  // id: String, // mongoose automatically creates _id
  title: {
    type: String,
    required: [true, 'Subtask title is required.'],
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required.'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Todo', 'Ongoing', 'Completed'],
    default: 'Todo',
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project', // Assuming you will have a Project model
    // required: true, // Decide if a task must be linked to a project
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low', 'None'],
    default: 'None',
  },
  tags: [{
    type: String,
    trim: true,
  }],
  subtasks: [subtaskSchema], // Array of subtasks
  startDate: {
    type: Date,
  },
  dueDate: {
    type: Date,
  },
  dependencies: [{ // IDs of other tasks this task depends on
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
  }],
  estimatedHours: {
    type: Number,
    min: 0,
  },
  actualHours: {
    type: Number,
    min: 0,
  },
  assignedTo: { // User ID of the assignee
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Automatically set to the logged-in user
  },
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

// Middleware to update `updatedAt` on save
taskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add indexes for frequently queried fields if necessary
// taskSchema.index({ projectId: 1, status: 1 });
// taskSchema.index({ assignedTo: 1 });
// taskSchema.index({ dueDate: 1 });


const Task = mongoose.model('Task', taskSchema);
const Subtask = mongoose.model('Subtask', subtaskSchema); // Export if needed directly, though usually managed via Task

module.exports = Task;
