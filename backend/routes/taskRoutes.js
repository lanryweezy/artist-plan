const express = require('express');
const taskController = require('../controllers/taskController');
const authController = require('../controllers/authController'); // For protect middleware

const router = express.Router();

// All routes below this middleware will be protected
router.use(authController.protect);

router
  .route('/')
  .get(taskController.getAllTasks)
  .post(taskController.createTask);

router
  .route('/:id')
  .get(taskController.getTaskById)
  .put(taskController.updateTask)
  .delete(taskController.deleteTask);

// Subtask routes
router
  .route('/:taskId/subtasks')
  .post(taskController.addSubtask); // Add a new subtask to a specific task

router
  .route('/:taskId/subtasks/:subtaskId')
  .put(taskController.updateSubtask)    // Update a specific subtask
  .delete(taskController.deleteSubtask); // Delete a specific subtask

module.exports = router;
