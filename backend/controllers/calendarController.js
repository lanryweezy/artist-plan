const CustomCalendarEvent = require('../models/CustomCalendarEvent');
const Task = require('../models/Task');
const Project = require('../models/Project');
const Campaign = require('../models/Campaign');

// --- CustomCalendarEvent Controllers ---

// @desc    Get all custom calendar events for the logged-in user
// @route   GET /api/calendar/custom-events
// @access  Private
exports.getAllCustomEvents = async (req, res) => {
  try {
    // TODO: Add filtering by date range from query parameters (e.g., ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD)
    const { startDate, endDate } = req.query;
    const query = { createdBy: req.user.id };

    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      query.date = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.date = { $lte: new Date(endDate) };
    }

    const events = await CustomCalendarEvent.find(query).sort({ date: 1, startTime: 1 });
    res.status(200).json({ status: 'success', results: events.length, data: { events } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error fetching custom events: ' + error.message });
  }
};

// @desc    Get a single custom calendar event by ID
// @route   GET /api/calendar/custom-events/:id
// @access  Private
exports.getCustomEventById = async (req, res) => {
  try {
    const event = await CustomCalendarEvent.findOne({ _id: req.params.id, createdBy: req.user.id });
    if (!event) {
      return res.status(404).json({ status: 'fail', message: 'Custom event not found.' });
    }
    res.status(200).json({ status: 'success', data: { event } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error fetching custom event: ' + error.message });
  }
};

// @desc    Create a new custom calendar event
// @route   POST /api/calendar/custom-events
// @access  Private
exports.createCustomEvent = async (req, res) => {
  try {
    const eventData = { ...req.body, createdBy: req.user.id };
    const event = await CustomCalendarEvent.create(eventData);
    res.status(201).json({ status: 'success', data: { event } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: 'Error creating custom event: ' + error.message, errors: error.errors });
  }
};

// @desc    Update a custom calendar event
// @route   PUT /api/calendar/custom-events/:id
// @access  Private
exports.updateCustomEvent = async (req, res) => {
  try {
    const event = await CustomCalendarEvent.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!event) {
      return res.status(404).json({ status: 'fail', message: 'Custom event not found or permission denied.' });
    }
    res.status(200).json({ status: 'success', data: { event } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: 'Error updating custom event: ' + error.message, errors: error.errors });
  }
};

// @desc    Delete a custom calendar event
// @route   DELETE /api/calendar/custom-events/:id
// @access  Private
exports.deleteCustomEvent = async (req, res) => {
  try {
    const event = await CustomCalendarEvent.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!event) {
      return res.status(404).json({ status: 'fail', message: 'Custom event not found or permission denied.' });
    }
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error deleting custom event: ' + error.message });
  }
};


// --- Aggregated Calendar View Controller ---

// @desc    Get all calendar events (tasks, project deadlines, campaigns, custom events) for a date range
// @route   GET /api/calendar/all-events
// @access  Private
exports.getAllCalendarEvents = async (req, res) => {
    try {
        const { startDate, endDate } = req.query; // Expect YYYY-MM-DD format
        const userId = req.user.id;
        let allEvents = [];

        if (!startDate || !endDate) {
            return res.status(400).json({ status: 'fail', message: 'Please provide both startDate and endDate query parameters.' });
        }

        const dateFilter = { $gte: new Date(startDate), $lte: new Date(endDate) };

        // 1. Fetch Tasks with due dates
        const tasks = await Task.find({ createdBy: userId, dueDate: dateFilter })
            .select('title dueDate status priority projectId')
            .populate('projectId', 'name');
        tasks.forEach(task => {
            allEvents.push({
                id: `task-${task._id}`,
                originalId: task._id,
                title: `Task: ${task.title}${task.projectId ? ` (${task.projectId.name})` : ''}`,
                date: task.dueDate.toISOString().split('T')[0], // YYYY-MM-DD
                type: 'task',
                color: task.status === 'Completed' ? '#77dd77' : (task.priority === 'High' ? '#ff6961' : '#aec6cf'), // Green if completed, Red if high prio, else blueish
                description: `Priority: ${task.priority}, Status: ${task.status}`,
                sourceModule: 'Tasks'
            });
        });

        // 2. Fetch Project due dates (overall project deadlines)
        const projectsWithDueDates = await Project.find({ createdBy: userId, dueDate: dateFilter })
            .select('name dueDate status');
        projectsWithDueDates.forEach(project => {
            allEvents.push({
                id: `project_due-${project._id}`,
                originalId: project._id,
                title: `Project Due: ${project.name}`,
                date: project.dueDate.toISOString().split('T')[0],
                type: 'project_due',
                color: project.status === 'Completed' ? '#77dd77' : '#fdfd96', // Yellowish
                description: `Status: ${project.status}`,
                sourceModule: 'Projects'
            });
        });

        // 2b. Fetch Project Milestones
        const projectsWithMilestones = await Project.find({
            createdBy: userId,
            'milestones.date': dateFilter
        }).select('name milestones');
        projectsWithMilestones.forEach(project => {
            project.milestones.forEach(milestone => {
                const milestoneDate = new Date(milestone.date);
                if (milestoneDate >= new Date(startDate) && milestoneDate <= new Date(endDate)) {
                    allEvents.push({
                        id: `project_milestone-${project._id}-${milestone._id}`,
                        originalId: milestone._id.toString(),
                        title: `Milestone: ${milestone.title} (${project.name})`,
                        date: milestoneDate.toISOString().split('T')[0],
                        type: 'project_milestone',
                        color: milestone.status === 'Completed' ? '#77dd77' : '#fdfd96', // Yellowish
                        description: `Status: ${milestone.status}`,
                        sourceModule: 'Projects'
                    });
                }
            });
        });


        // 3. Fetch Campaigns (start and end dates)
        const campaigns = await Campaign.find({
            createdBy: userId,
            $or: [
                { startDate: dateFilter },
                { endDate: dateFilter },
                { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } } // Overlapping campaigns
            ]
        }).select('name startDate endDate status campaignType');
        campaigns.forEach(campaign => {
            allEvents.push({
                id: `campaign-${campaign._id}`,
                originalId: campaign._id,
                title: `Campaign: ${campaign.name} (${campaign.campaignType})`,
                date: campaign.startDate.toISOString().split('T')[0],
                endDate: campaign.endDate ? campaign.endDate.toISOString().split('T')[0] : undefined,
                type: 'campaign',
                color: campaign.status === 'Completed' ? '#77dd77' : (campaign.status === 'Active' ? '#84b6f4' : '#cccccc'), // Blueish for active, grey for others
                description: `Status: ${campaign.status}`,
                sourceModule: 'Campaigns'
            });
        });

        // 4. Fetch Custom Events
        const customEvents = await CustomCalendarEvent.find({ createdBy: userId, date: dateFilter })
            .select('title date endDate startTime endTime description color');
        customEvents.forEach(event => {
            allEvents.push({
                id: `custom-${event._id}`,
                originalId: event._id,
                title: event.title,
                date: event.date.toISOString().split('T')[0],
                endDate: event.endDate ? event.endDate.toISOString().split('T')[0] : undefined,
                startTime: event.startTime,
                endTime: event.endTime,
                type: 'custom_event',
                color: event.color || '#3788d8',
                description: event.description,
                sourceModule: 'Custom'
            });
        });

        // Sort all collected events by date
        allEvents.sort((a, b) => new Date(a.date) - new Date(b.date) || (a.startTime && b.startTime ? a.startTime.localeCompare(b.startTime) : 0) );


        res.status(200).json({
            status: 'success',
            results: allEvents.length,
            data: {
                events: allEvents
            }
        });

    } catch (error) {
        console.error("Error fetching all calendar events:", error);
        res.status(500).json({ status: 'error', message: 'Error fetching all calendar events: ' + error.message });
    }
};
