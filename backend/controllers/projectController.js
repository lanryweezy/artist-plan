const Project = require('../models/Project');
const Task = require('../models/Task'); // To handle related tasks if needed (e.g., when deleting a project)

// @desc    Get all projects (filtered by user)
// @route   GET /api/projects
// @access  Private
exports.getAllProjects = async (req, res) => {
  try {
    // Filter projects by the logged-in user who created them
    // Add more filters based on query params: status, projectType, etc.
    const projects = await Project.find({ createdBy: req.user.id })
                                  .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({
      status: 'success',
      results: projects.length,
      data: {
        projects,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching projects: ' + error.message,
    });
  }
};

// @desc    Get a single project by ID
// @route   GET /api/projects/:id
// @access  Private
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, createdBy: req.user.id });

    if (!project) {
      return res.status(404).json({
        status: 'fail',
        message: 'No project found with that ID for this user.',
      });
    }

    // Optionally, populate related tasks if needed (can be a separate endpoint too for performance)
    // const tasks = await Task.find({ projectId: project._id, createdBy: req.user.id });

    res.status(200).json({
      status: 'success',
      data: {
        project,
        // tasks: tasks // if populated
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching project: ' + error.message,
    });
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res) => {
  try {
    const projectData = { ...req.body, createdBy: req.user.id };
    const project = await Project.create(projectData);

    res.status(201).json({
      status: 'success',
      data: {
        project,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Error creating project: ' + error.message,
      errors: error.errors
    });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        status: 'fail',
        message: 'No project found with that ID for this user, or you do not have permission to update.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        project,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Error updating project: ' + error.message,
      errors: error.errors
    });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });

    if (!project) {
      return res.status(404).json({
        status: 'fail',
        message: 'No project found with that ID for this user, or you do not have permission to delete.',
      });
    }

    // Optional: Handle related tasks. For example, unassign them from the project or delete them.
    // This depends on business logic. For now, we'll just delete the project.
    // Example: await Task.updateMany({ projectId: project._id }, { $unset: { projectId: "" } });
    // Or: await Task.deleteMany({ projectId: project._id });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error deleting project: ' + error.message,
    });
  }
};


// --- Milestone specific controllers (nested under projects) ---

// @desc    Add a milestone to a project
// @route   POST /api/projects/:projectId/milestones
// @access  Private
exports.addMilestone = async (req, res) => {
    try {
        const { title, date, status, description } = req.body;
        if (!title || !date) {
            return res.status(400).json({ status: 'fail', message: 'Milestone title and date are required.' });
        }

        const project = await Project.findOne({ _id: req.params.projectId, createdBy: req.user.id });
        if (!project) {
            return res.status(404).json({ status: 'fail', message: 'Project not found or you do not have permission.' });
        }

        const newMilestone = { title, date, status, description };
        project.milestones.push(newMilestone);
        await project.save();

        const addedMilestone = project.milestones[project.milestones.length - 1];

        res.status(201).json({
            status: 'success',
            data: { milestone: addedMilestone },
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error adding milestone: ' + error.message });
    }
};

// @desc    Update a milestone within a project
// @route   PUT /api/projects/:projectId/milestones/:milestoneId
// @access  Private
exports.updateMilestone = async (req, res) => {
    try {
        const { title, date, status, description } = req.body;
        const { projectId, milestoneId } = req.params;

        const project = await Project.findOne({ _id: projectId, createdBy: req.user.id });
        if (!project) {
            return res.status(404).json({ status: 'fail', message: 'Project not found or you do not have permission.' });
        }

        const milestone = project.milestones.id(milestoneId);
        if (!milestone) {
            return res.status(404).json({ status: 'fail', message: 'Milestone not found.' });
        }

        if (title !== undefined) milestone.title = title;
        if (date !== undefined) milestone.date = date;
        if (status !== undefined) milestone.status = status;
        if (description !== undefined) milestone.description = description;

        await project.save();

        res.status(200).json({
            status: 'success',
            data: { milestone },
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error updating milestone: ' + error.message });
    }
};

// @desc    Delete a milestone from a project
// @route   DELETE /api/projects/:projectId/milestones/:milestoneId
// @access  Private
exports.deleteMilestone = async (req, res) => {
    try {
        const { projectId, milestoneId } = req.params;

        const project = await Project.findOne({ _id: projectId, createdBy: req.user.id });
        if (!project) {
            return res.status(404).json({ status: 'fail', message: 'Project not found or you do not have permission.' });
        }

        const milestone = project.milestones.id(milestoneId);
        if (!milestone) {
            return res.status(404).json({ status: 'fail', message: 'Milestone not found.' });
        }

        project.milestones.pull(milestoneId); // Mongoose v6+ way to remove subdocument
        await project.save();

        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error deleting milestone: ' + error.message });
    }
};

// @desc    Get all tasks for a specific project
// @route   GET /api/projects/:projectId/tasks
// @access  Private
exports.getProjectTasks = async (req, res) => {
    try {
        const { projectId } = req.params;
        // First, ensure the project exists and belongs to the user
        const project = await Project.findOne({ _id: projectId, createdBy: req.user.id });
        if (!project) {
            return res.status(404).json({ status: 'fail', message: 'Project not found or you do not have permission.' });
        }

        // Then, fetch tasks associated with this project and created by the user
        const tasks = await Task.find({ projectId: projectId, createdBy: req.user.id })
                                .populate('assignedTo', 'name email')
                                .sort({ createdAt: -1 });

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
            message: 'Error fetching tasks for project: ' + error.message,
        });
    }
};
