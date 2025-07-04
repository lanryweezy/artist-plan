const express = require('express');
const financialController = require('../controllers/financialController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes
router.use(authController.protect);

// Financial Records Routes
router.route('/records')
  .get(financialController.getAllFinancialRecords)
  .post(financialController.createFinancialRecord);

router.route('/records/:id')
  .get(financialController.getFinancialRecordById)
  .put(financialController.updateFinancialRecord)
  .delete(financialController.deleteFinancialRecord);

// Budget Routes
router.route('/budgets')
  .get(financialController.getAllBudgets)
  .post(financialController.createBudget);

router.route('/budgets/:id')
  .get(financialController.getBudgetById)
  .put(financialController.updateBudget)
  .delete(financialController.deleteBudget);

// Financial Goals Routes
router.route('/goals')
  .get(financialController.getAllFinancialGoals)
  .post(financialController.createFinancialGoal);

router.route('/goals/:id')
  .get(financialController.getFinancialGoalById)
  .put(financialController.updateFinancialGoal)
  .delete(financialController.deleteFinancialGoal);

// Financial Summary Route
router.route('/summary')
    .get(financialController.getFinancialSummary);

module.exports = router;
