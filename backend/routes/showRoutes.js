const express = require('express');
const tourController = require('../controllers/tourController'); // Show controllers are in tourController for now
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes
router.use(authController.protect);

// General Show Routes
router.route('/')
  .get(tourController.getAllShows) // Can be filtered by tourId using query param: /api/shows?tourId=xxx
  .post(tourController.createShow);

router.route('/:id')
  .get(tourController.getShowById)
  .put(tourController.updateShow)
  .delete(tourController.deleteShow);

module.exports = router;
