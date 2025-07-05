const Campaign = require('../models/Campaign');

// @desc    Get all campaigns
// @route   GET /api/campaigns
// @access  Private
exports.getAllCampaigns = async (req, res) => {
  try {
    // TODO: Add filtering (status, type, date range), sorting, pagination
    const campaigns = await Campaign.find({ createdBy: req.user.id })
      .populate('linkedProjectId', 'name status') // Populate linked project details
      .sort({ startDate: -1, createdAt: -1 }); // Sort by start date then creation
    res.status(200).json({ status: 'success', results: campaigns.length, data: { campaigns } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error fetching campaigns: ' + error.message });
  }
};

// @desc    Get a single campaign by ID
// @route   GET /api/campaigns/:id
// @access  Private
exports.getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findOne({ _id: req.params.id, createdBy: req.user.id })
      .populate('linkedProjectId', 'name status projectType');
    if (!campaign) {
      return res.status(404).json({ status: 'fail', message: 'Campaign not found.' });
    }
    res.status(200).json({ status: 'success', data: { campaign } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error fetching campaign: ' + error.message });
  }
};

// @desc    Create a new campaign
// @route   POST /api/campaigns
// @access  Private
exports.createCampaign = async (req, res) => {
  try {
    const campaignData = { ...req.body, createdBy: req.user.id };
    const campaign = await Campaign.create(campaignData);
    res.status(201).json({ status: 'success', data: { campaign } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: 'Error creating campaign: ' + error.message, errors: error.errors });
  }
};

// @desc    Update a campaign
// @route   PUT /api/campaigns/:id
// @access  Private
exports.updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true, runValidators: true }
    ).populate('linkedProjectId', 'name status');
    if (!campaign) {
      return res.status(404).json({ status: 'fail', message: 'Campaign not found or permission denied.' });
    }
    res.status(200).json({ status: 'success', data: { campaign } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: 'Error updating campaign: ' + error.message, errors: error.errors });
  }
};

// @desc    Delete a campaign
// @route   DELETE /api/campaigns/:id
// @access  Private
exports.deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!campaign) {
      return res.status(404).json({ status: 'fail', message: 'Campaign not found or permission denied.' });
    }
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error deleting campaign: ' + error.message });
  }
};

// Future: Add controllers for managing aiGeneratedContent or performanceMetrics if they become more complex,
// e.g., adding a specific AI content snippet to a campaign.
// exports.addAiContentToCampaign = async (req, res) => { ... }
// exports.updatePerformanceMetric = async (req, res) => { ... }
