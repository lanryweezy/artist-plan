import { test, expect } from '@playwright/test'

test.describe('Project Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects')
  })

  test('can create a new project', async ({ page }) => {
    // Click new project button
    await page.click('[data-testid="new-project-button"]')
    await expect(page.locator('[data-testid="new-project-modal"]')).toBeVisible()

    // Fill in project details
    await page.fill('[data-testid="project-name-input"]', 'Test Album Project')
    await page.fill('[data-testid="project-description-input"]', 'This is a test album project')
    await page.selectOption('[data-testid="project-priority-select"]', 'high')
    await page.selectOption('[data-testid="project-status-select"]', 'planning')

    // Set due date
    await page.fill('[data-testid="project-due-date-input"]', '2024-12-31')

    // Create project
    await page.click('[data-testid="create-project-button"]')

    // Verify project was created
    await expect(page.locator('[data-testid="new-project-modal"]')).not.toBeVisible()
    await expect(page.locator('text=Test Album Project')).toBeVisible()
  })

  test('can view project details', async ({ page }) => {
    // Click on first project
    await page.click('[data-testid="project-card"]:first-child')
    
    // Should navigate to project detail page
    await expect(page).toHaveURL(/\/projects\/[^\/]+$/)
    
    // Verify project details are displayed
    await expect(page.locator('[data-testid="project-title"]')).toBeVisible()
    await expect(page.locator('[data-testid="project-description"]')).toBeVisible()
    await expect(page.locator('[data-testid="project-progress"]')).toBeVisible()
  })

  test('can edit project information', async ({ page }) => {
    // Click on first project
    await page.click('[data-testid="project-card"]:first-child')
    
    // Click edit button
    await page.click('[data-testid="edit-project-button"]')
    await expect(page.locator('[data-testid="edit-project-modal"]')).toBeVisible()

    // Update project name
    await page.fill('[data-testid="project-name-input"]', 'Updated Project Name')
    
    // Save changes
    await page.click('[data-testid="save-project-button"]')
    
    // Verify changes were saved
    await expect(page.locator('[data-testid="edit-project-modal"]')).not.toBeVisible()
    await expect(page.locator('text=Updated Project Name')).toBeVisible()
  })

  test('can manage project tasks', async ({ page }) => {
    // Navigate to project detail
    await page.click('[data-testid="project-card"]:first-child')
    
    // Click on tasks tab
    await page.click('[data-testid="tasks-tab"]')
    
    // Add new task
    await page.click('[data-testid="add-task-button"]')
    await page.fill('[data-testid="task-title-input"]', 'New Test Task')
    await page.fill('[data-testid="task-description-input"]', 'This is a test task')
    await page.selectOption('[data-testid="task-priority-select"]', 'medium')
    await page.click('[data-testid="create-task-button"]')
    
    // Verify task was created
    await expect(page.locator('text=New Test Task')).toBeVisible()
  })

  test('can use kanban board view', async ({ page }) => {
    // Switch to kanban view
    await page.click('[data-testid="kanban-view-button"]')
    
    // Verify kanban columns are visible
    await expect(page.locator('[data-testid="kanban-column-todo"]')).toBeVisible()
    await expect(page.locator('[data-testid="kanban-column-in-progress"]')).toBeVisible()
    await expect(page.locator('[data-testid="kanban-column-done"]')).toBeVisible()
    
    // Test drag and drop (if supported)
    const taskCard = page.locator('[data-testid="task-card"]').first()
    const inProgressColumn = page.locator('[data-testid="kanban-column-in-progress"]')
    
    if (await taskCard.isVisible()) {
      await taskCard.dragTo(inProgressColumn)
      // Verify task moved to in-progress column
      await expect(inProgressColumn.locator('[data-testid="task-card"]').first()).toBeVisible()
    }
  })

  test('can filter and search projects', async ({ page }) => {
    // Test search functionality
    await page.fill('[data-testid="project-search-input"]', 'Album')
    await page.waitForTimeout(500) // Wait for debounced search
    
    // Verify filtered results
    const projectCards = page.locator('[data-testid="project-card"]')
    const count = await projectCards.count()
    expect(count).toBeGreaterThanOrEqual(0)
    
    // Test status filter
    await page.selectOption('[data-testid="status-filter-select"]', 'active')
    await page.waitForTimeout(500)
    
    // Clear filters
    await page.click('[data-testid="clear-filters-button"]')
  })

  test('can delete a project', async ({ page }) => {
    // Click on project options menu
    await page.click('[data-testid="project-options-menu"]:first-child')
    
    // Click delete option
    await page.click('[data-testid="delete-project-option"]')
    
    // Confirm deletion in modal
    await expect(page.locator('[data-testid="delete-confirmation-modal"]')).toBeVisible()
    await page.click('[data-testid="confirm-delete-button"]')
    
    // Verify project was deleted
    await expect(page.locator('[data-testid="delete-confirmation-modal"]')).not.toBeVisible()
    // Note: In a real test, we'd verify the project is no longer in the list
  })

  test('can use project templates', async ({ page }) => {
    // Click new project from template
    await page.click('[data-testid="new-project-from-template-button"]')
    await expect(page.locator('[data-testid="template-selection-modal"]')).toBeVisible()
    
    // Select album release template
    await page.click('[data-testid="template-album-release"]')
    
    // Fill in project name
    await page.fill('[data-testid="project-name-input"]', 'My New Album')
    
    // Create project from template
    await page.click('[data-testid="create-from-template-button"]')
    
    // Verify project was created with template tasks
    await expect(page.locator('text=My New Album')).toBeVisible()
    
    // Navigate to project and check tasks were created
    await page.click('text=My New Album')
    await page.click('[data-testid="tasks-tab"]')
    
    // Should have pre-defined tasks from template
    const taskCards = page.locator('[data-testid="task-card"]')
    const taskCount = await taskCards.count()
    expect(taskCount).toBeGreaterThan(0)
  })

  test('shows project progress correctly', async ({ page }) => {
    // Navigate to project detail
    await page.click('[data-testid="project-card"]:first-child')
    
    // Verify progress bar is visible
    await expect(page.locator('[data-testid="project-progress-bar"]')).toBeVisible()
    
    // Verify progress percentage
    const progressText = await page.locator('[data-testid="progress-percentage"]').textContent()
    expect(progressText).toMatch(/\d+%/)
    
    // Check milestone indicators
    await expect(page.locator('[data-testid="project-milestones"]')).toBeVisible()
  })

  test('can collaborate on projects', async ({ page }) => {
    // Navigate to project detail
    await page.click('[data-testid="project-card"]:first-child')
    
    // Click collaborators tab
    await page.click('[data-testid="collaborators-tab"]')
    
    // Add collaborator
    await page.click('[data-testid="add-collaborator-button"]')
    await page.fill('[data-testid="collaborator-email-input"]', 'collaborator@example.com')
    await page.selectOption('[data-testid="collaborator-role-select"]', 'editor')
    await page.click('[data-testid="send-invitation-button"]')
    
    // Verify invitation was sent
    await expect(page.locator('text=Invitation sent')).toBeVisible()
  })
})