const express = require('express');
const calendarController = require('../controllers/calendarController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes
router.use(authController.protect);

// Route for aggregated calendar view (tasks, projects, campaigns, custom)
router.route('/all-events')
    .get(calendarController.getAllCalendarEvents);

// Custom Calendar Event Routes
router.route('/custom-events')
  .get(calendarController.getAllCustomEvents)
  .post(calendarController.createCustomEvent);

router.route('/custom-events/:id')
  .get(calendarController.getCustomEventById)
  .put(calendarController.updateCustomEvent)
  .delete(calendarController.deleteCustomEvent);

module.exports = router;
