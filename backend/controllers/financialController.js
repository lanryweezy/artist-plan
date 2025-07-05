const FinancialRecord = require('../models/FinancialRecord');
const Budget = require('../models/Budget');
const FinancialGoal = require('../models/FinancialGoal');

// --- Financial Record Controllers ---

// @desc    Get all financial records
// @route   GET /api/financials/records
// @access  Private
exports.getAllFinancialRecords = async (req, res) => {
  try {
    // TODO: Add filtering (type, date range, category), sorting, pagination
    const records = await FinancialRecord.find({ createdBy: req.user.id })
      .populate('budgetId', 'name')
      .populate('projectId', 'name')
      .sort({ date: -1 });
    res.status(200).json({ status: 'success', results: records.length, data: { records } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error fetching records: ' + error.message });
  }
};

// @desc    Get a single financial record
// @route   GET /api/financials/records/:id
// @access  Private
exports.getFinancialRecordById = async (req, res) => {
  try {
    const record = await FinancialRecord.findOne({ _id: req.params.id, createdBy: req.user.id })
      .populate('budgetId', 'name')
      .populate('projectId', 'name');
    if (!record) {
      return res.status(404).json({ status: 'fail', message: 'Record not found.' });
    }
    res.status(200).json({ status: 'success', data: { record } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error fetching record: ' + error.message });
  }
};

// @desc    Create a financial record
// @route   POST /api/financials/records
// @access  Private
exports.createFinancialRecord = async (req, res) => {
  try {
    const recordData = { ...req.body, createdBy: req.user.id };
    const record = await FinancialRecord.create(recordData);
    res.status(201).json({ status: 'success', data: { record } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: 'Error creating record: ' + error.message, errors: error.errors });
  }
};

// @desc    Update a financial record
// @route   PUT /api/financials/records/:id
// @access  Private
exports.updateFinancialRecord = async (req, res) => {
  try {
    const record = await FinancialRecord.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true, runValidators: true }
    ).populate('budgetId', 'name').populate('projectId', 'name');
    if (!record) {
      return res.status(404).json({ status: 'fail', message: 'Record not found or permission denied.' });
    }
    res.status(200).json({ status: 'success', data: { record } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: 'Error updating record: ' + error.message, errors: error.errors });
  }
};

// @desc    Delete a financial record
// @route   DELETE /api/financials/records/:id
// @access  Private
exports.deleteFinancialRecord = async (req, res) => {
  try {
    const record = await FinancialRecord.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!record) {
      return res.status(404).json({ status: 'fail', message: 'Record not found or permission denied.' });
    }
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error deleting record: ' + error.message });
  }
};

// --- Budget Controllers ---

// @desc    Get all budgets
// @route   GET /api/financials/budgets
// @access  Private
exports.getAllBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ createdBy: req.user.id })
        .populate('projectId', 'name')
        .sort({ createdAt: -1 });

    // For each budget, calculate spent and remaining amounts
    const budgetsWithDetails = await Promise.all(budgets.map(async (budget) => {
        const expenses = await FinancialRecord.find({ budgetId: budget._id, type: 'Expense', createdBy: req.user.id });
        const spentAmount = expenses.reduce((acc, record) => acc + record.amount, 0);
        return {
            ...budget.toObject(), // Convert Mongoose doc to plain object to add properties
            spentAmount,
            remainingAmount: budget.amount - spentAmount
        };
    }));

    res.status(200).json({ status: 'success', results: budgetsWithDetails.length, data: { budgets: budgetsWithDetails } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error fetching budgets: ' + error.message });
  }
};

// @desc    Get a single budget
// @route   GET /api/financials/budgets/:id
// @access  Private
exports.getBudgetById = async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, createdBy: req.user.id })
                               .populate('projectId', 'name');
    if (!budget) {
      return res.status(404).json({ status: 'fail', message: 'Budget not found.' });
    }

    const expenses = await FinancialRecord.find({ budgetId: budget._id, type: 'Expense', createdBy: req.user.id });
    const spentAmount = expenses.reduce((acc, record) => acc + record.amount, 0);
    const budgetWithDetails = {
        ...budget.toObject(),
        spentAmount,
        remainingAmount: budget.amount - spentAmount,
        associatedRecords: expenses // Optionally return associated records
    };

    res.status(200).json({ status: 'success', data: { budget: budgetWithDetails } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error fetching budget: ' + error.message });
  }
};

// @desc    Create a budget
// @route   POST /api/financials/budgets
// @access  Private
exports.createBudget = async (req, res) => {
  try {
    const budgetData = { ...req.body, createdBy: req.user.id };
    const budget = await Budget.create(budgetData);
    res.status(201).json({ status: 'success', data: { budget } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: 'Error creating budget: ' + error.message, errors: error.errors });
  }
};

// @desc    Update a budget
// @route   PUT /api/financials/budgets/:id
// @access  Private
exports.updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true, runValidators: true }
    ).populate('projectId', 'name');
    if (!budget) {
      return res.status(404).json({ status: 'fail', message: 'Budget not found or permission denied.' });
    }
    res.status(200).json({ status: 'success', data: { budget } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: 'Error updating budget: ' + error.message, errors: error.errors });
  }
};

// @desc    Delete a budget
// @route   DELETE /api/financials/budgets/:id
// @access  Private
exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!budget) {
      return res.status(404).json({ status: 'fail', message: 'Budget not found or permission denied.' });
    }
    // Optional: Unlink financial records from this budget
    // await FinancialRecord.updateMany({ budgetId: req.params.id, createdBy: req.user.id }, { $unset: { budgetId: "" } });
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error deleting budget: ' + error.message });
  }
};


// --- Financial Goal Controllers ---

// @desc    Get all financial goals
// @route   GET /api/financials/goals
// @access  Private
exports.getAllFinancialGoals = async (req, res) => {
  try {
    const goals = await FinancialGoal.find({ createdBy: req.user.id }).sort({ deadline: 1, priority: 1 });
    res.status(200).json({ status: 'success', results: goals.length, data: { goals } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error fetching goals: ' + error.message });
  }
};

// @desc    Get a single financial goal
// @route   GET /api/financials/goals/:id
// @access  Private
exports.getFinancialGoalById = async (req, res) => {
  try {
    const goal = await FinancialGoal.findOne({ _id: req.params.id, createdBy: req.user.id });
    if (!goal) {
      return res.status(404).json({ status: 'fail', message: 'Goal not found.' });
    }
    res.status(200).json({ status: 'success', data: { goal } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error fetching goal: ' + error.message });
  }
};

// @desc    Create a financial goal
// @route   POST /api/financials/goals
// @access  Private
exports.createFinancialGoal = async (req, res) => {
  try {
    const goalData = { ...req.body, createdBy: req.user.id };
    const goal = await FinancialGoal.create(goalData);
    res.status(201).json({ status: 'success', data: { goal } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: 'Error creating goal: ' + error.message, errors: error.errors });
  }
};

// @desc    Update a financial goal
// @route   PUT /api/financials/goals/:id
// @access  Private
exports.updateFinancialGoal = async (req, res) => {
  try {
    // Ensure currentAmount doesn't exceed targetAmount if targetAmount is also being updated
    if (req.body.targetAmount !== undefined && req.body.currentAmount !== undefined) {
        if (req.body.currentAmount > req.body.targetAmount) {
            return res.status(400).json({ status: 'fail', message: 'Current amount cannot exceed target amount.'});
        }
    } else if (req.body.currentAmount !== undefined) {
        const goal = await FinancialGoal.findById(req.params.id);
        if (goal && req.body.currentAmount > goal.targetAmount) {
             return res.status(400).json({ status: 'fail', message: 'Current amount cannot exceed target amount.'});
        }
    }


    const goal = await FinancialGoal.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!goal) {
      return res.status(404).json({ status: 'fail', message: 'Goal not found or permission denied.' });
    }
    res.status(200).json({ status: 'success', data: { goal } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: 'Error updating goal: ' + error.message, errors: error.errors });
  }
};

// @desc    Delete a financial goal
// @route   DELETE /api/financials/goals/:id
// @access  Private
exports.deleteFinancialGoal = async (req, res) => {
  try {
    const goal = await FinancialGoal.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!goal) {
      return res.status(404).json({ status: 'fail', message: 'Goal not found or permission denied.' });
    }
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error deleting goal: ' + error.message });
  }
};

// --- Financial Summary/Dashboard ---
// @desc    Get financial summary (income vs expense, etc.)
// @route   GET /api/financials/summary
// @access  Private
exports.getFinancialSummary = async (req, res) => {
    try {
        const { period, startDate, endDate, category, projectId } = req.query;
        const queryFilter = { createdBy: req.user.id };

        // Date filtering (example for 'monthly', 'yearly', or custom range)
        // This needs to be more robust based on 'period' (e.g., using date-fns or moment)
        if (startDate && endDate) {
            queryFilter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        } else if (period === 'thisMonth') {
            const start = new Date();
            start.setDate(1);
            start.setHours(0,0,0,0);
            const end = new Date(start);
            end.setMonth(start.getMonth() + 1);
            queryFilter.date = { $gte: start, $lt: end };
        }
        // Add more period filters: 'lastMonth', 'thisYear', 'lastYear'

        if (category) queryFilter.category = category;
        if (projectId) queryFilter.projectId = projectId;

        const records = await FinancialRecord.find(queryFilter);

        let totalIncome = 0;
        let totalExpenses = 0;
        const categoryBreakdown = { income: {}, expenses: {} };

        records.forEach(record => {
            if (record.type === 'Income') {
                totalIncome += record.amount;
                if (record.category) {
                    categoryBreakdown.income[record.category] = (categoryBreakdown.income[record.category] || 0) + record.amount;
                }
            } else if (record.type === 'Expense') {
                totalExpenses += record.amount;
                if (record.category) {
                    categoryBreakdown.expenses[record.category] = (categoryBreakdown.expenses[record.category] || 0) + record.amount;
                }
            }
        });

        const netBalance = totalIncome - totalExpenses;

        res.status(200).json({
            status: 'success',
            data: {
                totalIncome,
                totalExpenses,
                netBalance,
                categoryBreakdown,
                recordCount: records.length,
                filterUsed: queryFilter // For debugging or info
            }
        });

    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error fetching financial summary: ' + error.message });
    }
};
