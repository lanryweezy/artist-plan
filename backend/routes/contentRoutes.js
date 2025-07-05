const express = require('express');
const contentController = require('../controllers/contentController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes
router.use(authController.protect);

// ContentItem Routes
router.route('/items')
  .get(contentController.getAllContentItems)
  .post(contentController.createContentItem); // Later, add multer middleware here for uploads: .post(contentController.upload.single('file'), contentController.createContentItem)

router.route('/items/:id')
  .get(contentController.getContentItemById)
  .put(contentController.updateContentItem) // Later, add multer for file updates
  .delete(contentController.deleteContentItem);

// LyricsItem Routes
router.route('/lyrics')
  .get(contentController.getAllLyricsItems)
  .post(contentController.createLyricsItem);

router.route('/lyrics/:id')
  .get(contentController.getLyricsItemById)
  .put(contentController.updateLyricsItem)
  .delete(contentController.deleteLyricsItem);

module.exports = router;
