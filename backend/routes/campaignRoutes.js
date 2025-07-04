const express = require('express');
const campaignController = require('../controllers/campaignController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes
router.use(authController.protect);

router.route('/')
  .get(campaignController.getAllCampaigns)
  .post(campaignController.createCampaign);

router.route('/:id')
  .get(campaignController.getCampaignById)
  .put(campaignController.updateCampaign)
  .delete(campaignController.deleteCampaign);

module.exports = router;
