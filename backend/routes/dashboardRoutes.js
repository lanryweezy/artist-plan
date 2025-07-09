const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const authController = require('../controllers/authController'); // For protect middleware

const router = express.Router();

// All routes below this middleware will be protected
router.use(authController.protect);

router.route('/summary')
  .get(dashboardController.getDashboardSummary);

module.exports = router;
