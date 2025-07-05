const express = require('express');
const projectController = require('../controllers/projectController');
const authController = require('../controllers/authController'); // For protect middleware

const router = express.Router();

// All routes below this middleware will be protected
router.use(authController.protect);

router
  .route('/')
  .get(projectController.getAllProjects)
  .post(projectController.createProject);

router
  .route('/:id')
  .get(projectController.getProjectById)
  .put(projectController.updateProject)
  .delete(projectController.deleteProject);

// Routes for tasks associated with a specific project
router
    .route('/:projectId/tasks')
    .get(projectController.getProjectTasks);

// Milestone routes (nested under projects)
router
  .route('/:projectId/milestones')
  .post(projectController.addMilestone);

router
  .route('/:projectId/milestones/:milestoneId')
  .put(projectController.updateMilestone)
  .delete(projectController.deleteMilestone);

module.exports = router;
