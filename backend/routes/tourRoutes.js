const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes
router.use(authController.protect);

// Tour Routes
router.route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router.route('/:id')
  .get(tourController.getTourById)
  .put(tourController.updateTour)
  .delete(tourController.deleteTour);

// Shows for a specific tour
router.route('/:tourId/shows')
    .get(tourController.getShowsForTour);
    // POST to /api/shows with tourId in body is preferred for creating shows for a tour,
    // or a dedicated route like POST /api/tours/:tourId/shows could be added if needed.

// Standalone Show Routes (for managing shows that might not be part of a tour or for general show management)
// It's often good to have separate routes for sub-resources if they can also exist independently
// or have extensive individual management.
// We'll create a separate show router for /api/shows
// This router handles /api/tours/...

module.exports = router;
