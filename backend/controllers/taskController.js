const Task = require('../models/Task');

// @desc    Get all tasks (with filtering, sorting, pagination options)
// @route   GET /api/tasks
// @access  Private (requires user to be logged in)
exports.getAllTasks = async (req, res) => {
  try {
    // Basic filtering by user (tasks created by the logged-in user)
    // More advanced filtering can be added based on query parameters (status, priority, projectId, etc.)
    const tasks = await Task.find({ createdBy: req.user.id })
                           .populate('projectId', 'name') // Populate project name
                           .populate('assignedTo', 'name email') // Populate assignee details
                           .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({
      status: 'success',
      results: tasks.length,
      data: {
        tasks,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching tasks: ' + error.message,
    });
  }
};

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
// @access  Private
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, createdBy: req.user.id })
                           .populate('projectId', 'name')
                           .populate('assignedTo', 'name email')
                           .populate('subtasks'); // Ensure subtasks are populated if needed

    if (!task) {
      return res.status(404).json({
        status: 'fail',
        message: 'No task found with that ID for this user.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        task,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching task: ' + error.message,
    });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
  try {
    const { title, description, status, projectId, priority, tags, subtasks, dueDate, assignedTo, estimatedHours } = req.body;

    // Add createdBy field with the logged-in user's ID
    const newTaskData = {
      title,
      description,
      status,
      projectId,
      priority,
      tags,
      subtasks, // Assuming subtasks are sent in correct format
      dueDate,
      assignedTo,
      estimatedHours,
      createdBy: req.user.id, // Automatically set the creator
    };

    const task = await Task.create(newTaskData);

    res.status(201).json({
      status: 'success',
      data: {
        task,
      },
    });
  } catch (error) {
    res.status(400).json({ // 400 for bad request (e.g., validation error)
      status: 'fail',
      message: 'Error creating task: ' + error.message,
      errors: error.errors
    });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    // Ensure that only the user who created the task can update it, or an admin/assigned user in more complex scenarios
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id }, // Query condition
      req.body, // Data to update
      { new: true, runValidators: true } // Options: return new doc, run schema validators
    ).populate('projectId', 'name').populate('assignedTo', 'name email');

    if (!task) {
      return res.status(404).json({
        status: 'fail',
        message: 'No task found with that ID for this user, or you do not have permission to update.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        task,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Error updating task: ' + error.message,
      errors: error.errors
    });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });

    if (!task) {
      return res.status(404).json({
        status: 'fail',
        message: 'No task found with that ID for this user, or you do not have permission to delete.',
      });
    }

    res.status(204).json({ // 204 No Content for successful deletion
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error deleting task: ' + error.message,
    });
  }
};


// --- Subtask specific controllers ---

// @desc    Add a subtask to a task
// @route   POST /api/tasks/:taskId/subtasks
// @access  Private
exports.addSubtask = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ status: 'fail', message: 'Subtask title is required.' });
    }

    const task = await Task.findOne({ _id: req.params.taskId, createdBy: req.user.id });
    if (!task) {
      return res.status(404).json({ status: 'fail', message: 'Task not found or you do not have permission.' });
    }

    // Mongoose automatically creates an _id for the subtask
    const newSubtask = { title, completed: false };
    task.subtasks.push(newSubtask);
    await task.save();

    // Find the newly added subtask (it will be the last one)
    const addedSubtask = task.subtasks[task.subtasks.length - 1];

    res.status(201).json({
      status: 'success',
      data: { subtask: addedSubtask }, // Return the created subtask with its ID
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error adding subtask: ' + error.message });
  }
};

// @desc    Update a subtask within a task
// @route   PUT /api/tasks/:taskId/subtasks/:subtaskId
// @access  Private
exports.updateSubtask = async (req, res) => {
  try {
    const { title, completed } = req.body;
    const { taskId, subtaskId } = req.params;

    const task = await Task.findOne({ _id: taskId, createdBy: req.user.id });
    if (!task) {
      return res.status(404).json({ status: 'fail', message: 'Task not found or you do not have permission.' });
    }

    const subtask = task.subtasks.id(subtaskId); // Mongoose helper to find subdocument by ID
    if (!subtask) {
      return res.status(404).json({ status: 'fail', message: 'Subtask not found.' });
    }

    if (title !== undefined) subtask.title = title;
    if (completed !== undefined) subtask.completed = completed;

    await task.save();

    res.status(200).json({
      status: 'success',
      data: { subtask },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error updating subtask: ' + error.message });
  }
};

// @desc    Delete a subtask from a task
// @route   DELETE /api/tasks/:taskId/subtasks/:subtaskId
// @access  Private
exports.deleteSubtask = async (req, res) => {
  try {
    const { taskId, subtaskId } = req.params;

    const task = await Task.findOne({ _id: taskId, createdBy: req.user.id });
    if (!task) {
      return res.status(404).json({ status: 'fail', message: 'Task not found or you do not have permission.' });
    }

    const subtask = task.subtasks.id(subtaskId);
    if (!subtask) {
      return res.status(404).json({ status: 'fail', message: 'Subtask not found.' });
    }

    // Mongoose < v6 way to remove subdocument
    // subtask.remove();
    // Mongoose v6+ way to remove subdocument (pull from array)
    task.subtasks.pull(subtaskId);


    await task.save();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error deleting subtask: ' + error.message });
  }
};
