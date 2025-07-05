const express = require('express');
const authController = require('../controllers/authController'); // Correct path

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Example of a protected route (can be added to other route files)
// router.get('/me', authController.protect, (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     data: {
//       user: req.user
//     }
//   });
// });

module.exports = router;
