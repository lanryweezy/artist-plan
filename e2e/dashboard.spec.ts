import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/dashboard')
  })

  test('displays dashboard metrics correctly', async ({ page }) => {
    // Check that main metrics cards are visible
    await expect(page.locator('[data-testid="metrics-total-projects"]')).toBeVisible()
    await expect(page.locator('[data-testid="metrics-active-projects"]')).toBeVisible()
    await expect(page.locator('[data-testid="metrics-collaborators"]')).toBeVisible()
    await expect(page.locator('[data-testid="metrics-content-items"]')).toBeVisible()

    // Verify metrics have numeric values
    const totalProjects = await page.locator('[data-testid="metrics-total-projects"] .metric-value').textContent()
    expect(totalProjects).toMatch(/^\d+$/)
  })

  test('shows recent activity feed', async ({ page }) => {
    await expect(page.locator('[data-testid="recent-activity"]')).toBeVisible()
    
    // Check for activity items
    const activityItems = page.locator('[data-testid="activity-item"]')
    await expect(activityItems.first()).toBeVisible()
  })

  test('displays upcoming deadlines', async ({ page }) => {
    await expect(page.locator('[data-testid="upcoming-deadlines"]')).toBeVisible()
    
    // Check for deadline items
    const deadlineItems = page.locator('[data-testid="deadline-item"]')
    const count = await deadlineItems.count()
    expect(count).toBeGreaterThanOrEqual(0)
  })

  test('shows AI insights section', async ({ page }) => {
    await expect(page.locator('[data-testid="ai-insights"]')).toBeVisible()
    
    // Check for AI suggestion cards
    const insightCards = page.locator('[data-testid="ai-insight-card"]')
    await expect(insightCards.first()).toBeVisible()
  })

  test('quick actions are functional', async ({ page }) => {
    // Test "New Project" quick action
    await page.click('[data-testid="quick-action-new-project"]')
    await expect(page.locator('[data-testid="new-project-modal"]')).toBeVisible()
    
    // Close modal
    await page.click('[data-testid="modal-close"]')
    await expect(page.locator('[data-testid="new-project-modal"]')).not.toBeVisible()
  })

  test('navigation sidebar works correctly', async ({ page }) => {
    // Test navigation to different sections
    await page.click('[data-testid="nav-projects"]')
    await expect(page).toHaveURL('/projects')
    
    await page.click('[data-testid="nav-dashboard"]')
    await expect(page).toHaveURL('/dashboard')
    
    await page.click('[data-testid="nav-finances"]')
    await expect(page).toHaveURL('/finances')
  })

  test('responsive design works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check that mobile menu toggle is visible
    await expect(page.locator('[data-testid="mobile-menu-toggle"]')).toBeVisible()
    
    // Open mobile menu
    await page.click('[data-testid="mobile-menu-toggle"]')
    await expect(page.locator('[data-testid="mobile-nav"]')).toBeVisible()
    
    // Test navigation in mobile menu
    await page.click('[data-testid="mobile-nav-projects"]')
    await expect(page).toHaveURL('/projects')
  })

  test('real-time updates work', async ({ page }) => {
    // Mock WebSocket connection
    await page.addInitScript(() => {
      // Mock WebSocket for testing
      window.WebSocket = class MockWebSocket {
        constructor(url) {
          this.url = url
          this.readyState = 1 // OPEN
          setTimeout(() => {
            if (this.onmessage) {
              this.onmessage({
                data: JSON.stringify({
                  type: 'metrics_update',
                  data: { totalProjects: 10 }
                })
              })
            }
          }, 1000)
        }
        send() {}
        close() {}
        addEventListener() {}
        removeEventListener() {}
      }
    })
    
    await page.reload()
    
    // Wait for potential real-time updates
    await page.waitForTimeout(2000)
    
    // Verify connection indicator shows connected state
    await expect(page.locator('[data-testid="connection-status"]')).toHaveClass(/connected/)
  })

  test('dashboard settings can be accessed and modified', async ({ page }) => {
    // Open dashboard settings
    await page.click('[data-testid="dashboard-settings-button"]')
    await expect(page.locator('[data-testid="dashboard-settings-modal"]')).toBeVisible()
    
    // Test theme toggle
    const themeToggle = page.locator('[data-testid="theme-toggle"]')
    await themeToggle.click()
    
    // Save settings
    await page.click('[data-testid="save-settings-button"]')
    await expect(page.locator('[data-testid="dashboard-settings-modal"]')).not.toBeVisible()
  })

  test('performance monitoring displays correctly', async ({ page }) => {
    await expect(page.locator('[data-testid="performance-monitor"]')).toBeVisible()
    
    // Check for performance metrics
    const loadTime = page.locator('[data-testid="page-load-time"]')
    await expect(loadTime).toBeVisible()
    
    const memoryUsage = page.locator('[data-testid="memory-usage"]')
    await expect(memoryUsage).toBeVisible()
  })
})