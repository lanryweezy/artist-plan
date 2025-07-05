const Tour = require('../models/Tour');
const Show = require('../models/Show');

// --- Tour Controllers ---

// @desc    Get all tours
// @route   GET /api/tours
// @access  Private
exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find({ createdBy: req.user.id }).sort({ startDate: -1 });
    res.status(200).json({ status: 'success', results: tours.length, data: { tours } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error fetching tours: ' + error.message });
  }
};

// @desc    Get a single tour by ID
// @route   GET /api/tours/:id
// @access  Private
exports.getTourById = async (req, res) => {
  try {
    const tour = await Tour.findOne({ _id: req.params.id, createdBy: req.user.id });
    if (!tour) {
      return res.status(404).json({ status: 'fail', message: 'Tour not found.' });
    }
    // Optionally fetch shows for this tour
    const shows = await Show.find({ tourId: tour._id, createdBy: req.user.id }).sort({ date: 1 });
    res.status(200).json({ status: 'success', data: { tour, shows } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error fetching tour: ' + error.message });
  }
};

// @desc    Create a new tour
// @route   POST /api/tours
// @access  Private
exports.createTour = async (req, res) => {
  try {
    const tourData = { ...req.body, createdBy: req.user.id };
    const tour = await Tour.create(tourData);
    res.status(201).json({ status: 'success', data: { tour } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: 'Error creating tour: ' + error.message, errors: error.errors });
  }
};

// @desc    Update a tour
// @route   PUT /api/tours/:id
// @access  Private
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!tour) {
      return res.status(404).json({ status: 'fail', message: 'Tour not found or permission denied.' });
    }
    res.status(200).json({ status: 'success', data: { tour } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: 'Error updating tour: ' + error.message, errors: error.errors });
  }
};

// @desc    Delete a tour
// @route   DELETE /api/tours/:id
// @access  Private
exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!tour) {
      return res.status(404).json({ status: 'fail', message: 'Tour not found or permission denied.' });
    }
    // Optional: Delete all shows associated with this tour
    await Show.deleteMany({ tourId: req.params.id, createdBy: req.user.id });
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error deleting tour: ' + error.message });
  }
};


// --- Show Controllers ---
// These can be nested under a tour or standalone if a show isn't part of a tour.
// For simplicity, we'll assume shows are primarily managed via /api/shows,
// but can be queried via a tour.

// @desc    Get all shows (can be filtered by tourId in query)
// @route   GET /api/shows
// @access  Private
exports.getAllShows = async (req, res) => {
  try {
    const query = { createdBy: req.user.id };
    if (req.query.tourId) {
      query.tourId = req.query.tourId;
    }
    const shows = await Show.find(query)
        .populate('tourId', 'name region')
        .sort({ date: 1 });
    res.status(200).json({ status: 'success', results: shows.length, data: { shows } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error fetching shows: ' + error.message });
  }
};

// @desc    Get a single show by ID
// @route   GET /api/shows/:id
// @access  Private
exports.getShowById = async (req, res) => {
  try {
    const show = await Show.findOne({ _id: req.params.id, createdBy: req.user.id })
                           .populate('tourId', 'name region status');
    if (!show) {
      return res.status(404).json({ status: 'fail', message: 'Show not found.' });
    }
    res.status(200).json({ status: 'success', data: { show } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error fetching show: ' + error.message });
  }
};

// @desc    Create a new show
// @route   POST /api/shows
// @access  Private
exports.createShow = async (req, res) => {
  try {
    const showData = { ...req.body, createdBy: req.user.id };
    // If tourId is provided, verify it exists and belongs to the user
    if (showData.tourId) {
        const tour = await Tour.findOne({ _id: showData.tourId, createdBy: req.user.id });
        if (!tour) {
            return res.status(400).json({ status: 'fail', message: 'Associated tour not found or permission denied.' });
        }
    }
    const show = await Show.create(showData);
    res.status(201).json({ status: 'success', data: { show } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: 'Error creating show: ' + error.message, errors: error.errors });
  }
};

// @desc    Update a show
// @route   PUT /api/shows/:id
// @access  Private
exports.updateShow = async (req, res) => {
  try {
    const showData = { ...req.body };
     // If tourId is being changed, verify it exists and belongs to the user
    if (showData.tourId) {
        const tour = await Tour.findOne({ _id: showData.tourId, createdBy: req.user.id });
        if (!tour) {
            return res.status(400).json({ status: 'fail', message: 'Associated tour not found or permission denied.' });
        }
    }

    const show = await Show.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      showData,
      { new: true, runValidators: true }
    ).populate('tourId', 'name region');
    if (!show) {
      return res.status(404).json({ status: 'fail', message: 'Show not found or permission denied.' });
    }
    res.status(200).json({ status: 'success', data: { show } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: 'Error updating show: ' + error.message, errors: error.errors });
  }
};

// @desc    Delete a show
// @route   DELETE /api/shows/:id
// @access  Private
exports.deleteShow = async (req, res) => {
  try {
    const show = await Show.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!show) {
      return res.status(404).json({ status: 'fail', message: 'Show not found or permission denied.' });
    }
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error deleting show: ' + error.message });
  }
};

// Specific route to get all shows for a particular tour
// @desc    Get all shows for a specific tour
// @route   GET /api/tours/:tourId/shows
// @access  Private
exports.getShowsForTour = async (req, res) => {
    try {
        const { tourId } = req.params;
        // Verify tour exists and belongs to user
        const tour = await Tour.findOne({ _id: tourId, createdBy: req.user.id });
        if (!tour) {
            return res.status(404).json({ status: 'fail', message: 'Tour not found or permission denied.' });
        }

        const shows = await Show.find({ tourId: tourId, createdBy: req.user.id })
                                .sort({ date: 1 });
        res.status(200).json({ status: 'success', results: shows.length, data: { shows } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error fetching shows for tour: ' + error.message });
    }
};
