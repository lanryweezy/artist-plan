const ContentItem = require('../models/ContentItem');
const LyricsItem = require('../models/LyricsItem');
// For file uploads, you'd typically use a library like 'multer' for handling multipart/form-data
// const multer = require('multer');
// const path = require('path');

// Basic Multer setup (example - needs configuration for storage like S3 or local disk)
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // Ensure 'uploads/' directory exists
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// });
// exports.upload = multer({ storage: storage });
// We will add actual file upload logic later when we have a storage strategy.
// For now, filePathOrUrl will be manually set via request body.


// --- ContentItem Controllers ---

// @desc    Get all content items
// @route   GET /api/content/items
// @access  Private
exports.getAllContentItems = async (req, res) => {
  try {
    // TODO: Filtering (type, status, tags, projectId, campaignId), sorting, pagination
    const items = await ContentItem.find({ createdBy: req.user.id })
      .populate('associatedProjectId', 'name')
      .populate('campaignId', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', results: items.length, data: { items } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error fetching content items: ' + error.message });
  }
};

// @desc    Get a single content item by ID
// @route   GET /api/content/items/:id
// @access  Private
exports.getContentItemById = async (req, res) => {
  try {
    const item = await ContentItem.findOne({ _id: req.params.id, createdBy: req.user.id })
      .populate('associatedProjectId', 'name')
      .populate('campaignId', 'name');
    if (!item) {
      return res.status(404).json({ status: 'fail', message: 'Content item not found.' });
    }
    res.status(200).json({ status: 'success', data: { item } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error fetching content item: ' + error.message });
  }
};

// @desc    Create a new content item
// @route   POST /api/content/items
// @access  Private
// When using multer for file uploads, the route handler would look like:
// exports.createContentItem = exports.upload.single('contentFile'), async (req, res) => { ... }
// And req.file would contain file info, req.body for other fields.
exports.createContentItem = async (req, res) => {
  try {
    const itemData = { ...req.body, createdBy: req.user.id };

    // If actual file upload is implemented with multer:
    // if (req.file) {
    //   itemData.filePathOrUrl = req.file.path; // Or URL if uploaded to cloud
    //   itemData.fileSize = req.file.size;
    // }

    const item = await ContentItem.create(itemData);
    res.status(201).json({ status: 'success', data: { item } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: 'Error creating content item: ' + error.message, errors: error.errors });
  }
};

// @desc    Update a content item
// @route   PUT /api/content/items/:id
// @access  Private
exports.updateContentItem = async (req, res) => {
  try {
    // Handle file update if a new file is uploaded (would involve deleting old, uploading new)
    // For now, assumes filePathOrUrl is updated directly if changed.
    const item = await ContentItem.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true, runValidators: true }
    ).populate('associatedProjectId', 'name').populate('campaignId', 'name');

    if (!item) {
      return res.status(404).json({ status: 'fail', message: 'Content item not found or permission denied.' });
    }
    res.status(200).json({ status: 'success', data: { item } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: 'Error updating content item: ' + error.message, errors: error.errors });
  }
};

// @desc    Delete a content item
// @route   DELETE /api/content/items/:id
// @access  Private
exports.deleteContentItem = async (req, res) => {
  try {
    const item = await ContentItem.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!item) {
      return res.status(404).json({ status: 'fail', message: 'Content item not found or permission denied.' });
    }
    // If files are stored, you'd also delete the actual file from storage here (e.g., fs.unlink for local, S3 deleteObject)
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error deleting content item: ' + error.message });
  }
};


// --- LyricsItem Controllers ---

// @desc    Get all lyrics items
// @route   GET /api/content/lyrics
// @access  Private
exports.getAllLyricsItems = async (req, res) => {
  try {
    // TODO: Filtering (status, tags, projectId), sorting, pagination
    const items = await LyricsItem.find({ createdBy: req.user.id })
      .populate('associatedProjectId', 'name')
      .sort({ updatedAt: -1 });
    res.status(200).json({ status: 'success', results: items.length, data: { items } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error fetching lyrics items: ' + error.message });
  }
};

// @desc    Get a single lyrics item by ID
// @route   GET /api/content/lyrics/:id
// @access  Private
exports.getLyricsItemById = async (req, res) => {
  try {
    const item = await LyricsItem.findOne({ _id: req.params.id, createdBy: req.user.id })
      .populate('associatedProjectId', 'name');
    if (!item) {
      return res.status(404).json({ status: 'fail', message: 'Lyrics item not found.' });
    }
    res.status(200).json({ status: 'success', data: { item } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error fetching lyrics item: ' + error.message });
  }
};

// @desc    Create a new lyrics item
// @route   POST /api/content/lyrics
// @access  Private
exports.createLyricsItem = async (req, res) => {
  try {
    const itemData = { ...req.body, createdBy: req.user.id };
    const item = await LyricsItem.create(itemData);
    res.status(201).json({ status: 'success', data: { item } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: 'Error creating lyrics item: ' + error.message, errors: error.errors });
  }
};

// @desc    Update a lyrics item
// @route   PUT /api/content/lyrics/:id
// @access  Private
exports.updateLyricsItem = async (req, res) => {
  try {
    const item = await LyricsItem.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true, runValidators: true }
    ).populate('associatedProjectId', 'name');
    if (!item) {
      return res.status(404).json({ status: 'fail', message: 'Lyrics item not found or permission denied.' });
    }
    res.status(200).json({ status: 'success', data: { item } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: 'Error updating lyrics item: ' + error.message, errors: error.errors });
  }
};

// @desc    Delete a lyrics item
// @route   DELETE /api/content/lyrics/:id
// @access  Private
exports.deleteLyricsItem = async (req, res) => {
  try {
    const item = await LyricsItem.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!item) {
      return res.status(404).json({ status: 'fail', message: 'Lyrics item not found or permission denied.' });
    }
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error deleting lyrics item: ' + error.message });
  }
};
