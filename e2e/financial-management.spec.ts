import { test, expect } from '@playwright/test'

test.describe('Financial Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/finances')
  })

  test('displays financial overview correctly', async ({ page }) => {
    // Check main financial metrics
    await expect(page.locator('[data-testid="total-income-metric"]')).toBeVisible()
    await expect(page.locator('[data-testid="total-expenses-metric"]')).toBeVisible()
    await expect(page.locator('[data-testid="net-income-metric"]')).toBeVisible()
    await expect(page.locator('[data-testid="monthly-growth-metric"]')).toBeVisible()

    // Verify financial charts are displayed
    await expect(page.locator('[data-testid="income-expense-chart"]')).toBeVisible()
    await expect(page.locator('[data-testid="category-breakdown-chart"]')).toBeVisible()
  })

  test('can add income record', async ({ page }) => {
    // Click add income button
    await page.click('[data-testid="add-income-button"]')
    await expect(page.locator('[data-testid="add-financial-record-modal"]')).toBeVisible()

    // Fill in income details
    await page.fill('[data-testid="amount-input"]', '1500.00')
    await page.selectOption('[data-testid="category-select"]', 'streaming')
    await page.fill('[data-testid="description-input"]', 'Spotify royalties for December')
    await page.fill('[data-testid="date-input"]', '2024-01-15')

    // Save record
    await page.click('[data-testid="save-record-button"]')

    // Verify record was added
    await expect(page.locator('[data-testid="add-financial-record-modal"]')).not.toBeVisible()
    await expect(page.locator('text=Spotify royalties for December')).toBeVisible()
  })

  test('can add expense record', async ({ page }) => {
    // Click add expense button
    await page.click('[data-testid="add-expense-button"]')
    await expect(page.locator('[data-testid="add-financial-record-modal"]')).toBeVisible()

    // Fill in expense details
    await page.fill('[data-testid="amount-input"]', '500.00')
    await page.selectOption('[data-testid="category-select"]', 'equipment')
    await page.fill('[data-testid="description-input"]', 'New microphone')
    await page.fill('[data-testid="date-input"]', '2024-01-10')

    // Save record
    await page.click('[data-testid="save-record-button"]')

    // Verify record was added
    await expect(page.locator('text=New microphone')).toBeVisible()
  })

  test('can filter financial records', async ({ page }) => {
    // Test date range filter
    await page.fill('[data-testid="start-date-filter"]', '2024-01-01')
    await page.fill('[data-testid="end-date-filter"]', '2024-01-31')
    await page.click('[data-testid="apply-date-filter-button"]')

    // Test category filter
    await page.selectOption('[data-testid="category-filter-select"]', 'streaming')
    await page.waitForTimeout(500)

    // Test type filter
    await page.selectOption('[data-testid="type-filter-select"]', 'income')
    await page.waitForTimeout(500)

    // Clear filters
    await page.click('[data-testid="clear-filters-button"]')
  })

  test('can edit financial record', async ({ page }) => {
    // Click on first financial record
    await page.click('[data-testid="financial-record-row"]:first-child [data-testid="edit-record-button"]')
    await expect(page.locator('[data-testid="edit-financial-record-modal"]')).toBeVisible()

    // Update amount
    await page.fill('[data-testid="amount-input"]', '1800.00')
    await page.fill('[data-testid="description-input"]', 'Updated Spotify royalties')

    // Save changes
    await page.click('[data-testid="save-record-button"]')

    // Verify changes were saved
    await expect(page.locator('[data-testid="edit-financial-record-modal"]')).not.toBeVisible()
    await expect(page.locator('text=Updated Spotify royalties')).toBeVisible()
  })

  test('can delete financial record', async ({ page }) => {
    // Click delete button on first record
    await page.click('[data-testid="financial-record-row"]:first-child [data-testid="delete-record-button"]')
    
    // Confirm deletion
    await expect(page.locator('[data-testid="delete-confirmation-modal"]')).toBeVisible()
    await page.click('[data-testid="confirm-delete-button"]')

    // Verify record was deleted
    await expect(page.locator('[data-testid="delete-confirmation-modal"]')).not.toBeVisible()
  })

  test('can create and manage budgets', async ({ page }) => {
    // Navigate to budgets tab
    await page.click('[data-testid="budgets-tab"]')

    // Create new budget
    await page.click('[data-testid="create-budget-button"]')
    await expect(page.locator('[data-testid="create-budget-modal"]')).toBeVisible()

    // Fill in budget details
    await page.fill('[data-testid="budget-name-input"]', 'Q1 Marketing Budget')
    await page.fill('[data-testid="budget-amount-input"]', '2000.00')
    await page.selectOption('[data-testid="budget-category-select"]', 'marketing')
    await page.selectOption('[data-testid="budget-period-select"]', 'quarterly')

    // Save budget
    await page.click('[data-testid="save-budget-button"]')

    // Verify budget was created
    await expect(page.locator('text=Q1 Marketing Budget')).toBeVisible()
    
    // Check budget progress bar
    await expect(page.locator('[data-testid="budget-progress-bar"]')).toBeVisible()
  })

  test('displays financial reports correctly', async ({ page }) => {
    // Navigate to reports tab
    await page.click('[data-testid="reports-tab"]')

    // Check that report charts are visible
    await expect(page.locator('[data-testid="monthly-income-chart"]')).toBeVisible()
    await expect(page.locator('[data-testid="expense-category-chart"]')).toBeVisible()
    await expect(page.locator('[data-testid="profit-loss-chart"]')).toBeVisible()

    // Test report date range
    await page.selectOption('[data-testid="report-period-select"]', 'last-6-months')
    await page.waitForTimeout(1000) // Wait for chart to update

    // Test export functionality
    await page.click('[data-testid="export-report-button"]')
    await expect(page.locator('[data-testid="export-options-menu"]')).toBeVisible()
    
    // Test PDF export
    const downloadPromise = page.waitForEvent('download')
    await page.click('[data-testid="export-pdf-option"]')
    const download = await downloadPromise
    expect(download.suggestedFilename()).toContain('.pdf')
  })

  test('can set financial goals', async ({ page }) => {
    // Navigate to goals tab
    await page.click('[data-testid="goals-tab"]')

    // Create new goal
    await page.click('[data-testid="create-goal-button"]')
    await expect(page.locator('[data-testid="create-goal-modal"]')).toBeVisible()

    // Fill in goal details
    await page.fill('[data-testid="goal-name-input"]', 'Monthly Streaming Revenue')
    await page.fill('[data-testid="goal-target-input"]', '5000.00')
    await page.selectOption('[data-testid="goal-period-select"]', 'monthly')
    await page.fill('[data-testid="goal-deadline-input"]', '2024-12-31')

    // Save goal
    await page.click('[data-testid="save-goal-button"]')

    // Verify goal was created
    await expect(page.locator('text=Monthly Streaming Revenue')).toBeVisible()
    
    // Check goal progress
    await expect(page.locator('[data-testid="goal-progress-indicator"]')).toBeVisible()
  })

  test('shows AI financial insights', async ({ page }) => {
    // Check AI insights section
    await expect(page.locator('[data-testid="ai-financial-insights"]')).toBeVisible()

    // Verify insight cards are displayed
    const insightCards = page.locator('[data-testid="ai-insight-card"]')
    await expect(insightCards.first()).toBeVisible()

    // Test applying an AI suggestion
    await page.click('[data-testid="apply-suggestion-button"]:first-child')
    
    // Should show confirmation or execute the suggestion
    await expect(page.locator('[data-testid="suggestion-applied-notification"]')).toBeVisible()
  })

  test('integrates with external financial services', async ({ page }) => {
    // Navigate to integrations tab
    await page.click('[data-testid="integrations-tab"]')

    // Check available integrations
    await expect(page.locator('[data-testid="paypal-integration"]')).toBeVisible()
    await expect(page.locator('[data-testid="stripe-integration"]')).toBeVisible()

    // Test connecting an integration (mock)
    await page.click('[data-testid="connect-paypal-button"]')
    await expect(page.locator('[data-testid="integration-auth-modal"]')).toBeVisible()
    
    // Mock successful connection
    await page.click('[data-testid="mock-successful-connection"]')
    await expect(page.locator('[data-testid="integration-connected-status"]')).toBeVisible()
  })

  test('handles currency formatting correctly', async ({ page }) => {
    // Check that amounts are formatted as currency
    const incomeMetric = await page.locator('[data-testid="total-income-metric"] .metric-value').textContent()
    expect(incomeMetric).toMatch(/\$[\d,]+\.?\d*/)

    const expenseMetric = await page.locator('[data-testid="total-expenses-metric"] .metric-value').textContent()
    expect(expenseMetric).toMatch(/\$[\d,]+\.?\d*/)
  })
})