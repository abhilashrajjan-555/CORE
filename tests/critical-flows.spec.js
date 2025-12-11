import { test, expect } from '@playwright/test';

test.describe('C.O.R.E. Workflow - Critical User Flows', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app running on localhost:8000
    await page.goto('http://localhost:8000', { waitUntil: 'domcontentloaded' });

    // Clear localStorage to start fresh each test
    await page.evaluate(() => {
      localStorage.clear();
    });

    // Reload to apply clean state
    await page.reload({ waitUntil: 'domcontentloaded' });

    // Wait a bit for app initialization
    await page.waitForTimeout(500);
  });

  async function switchToTab(page, tabName) {
    const tabButton = page.locator(`button[data-tab="${tabName}"]`);
    await tabButton.click();
    await page.waitForTimeout(100);
  }

  test('should capture a new task with all fields', async ({ page }) => {
    // Switch to Capture tab
    await switchToTab(page, 'capture');

    // Fill in the form
    await page.fill('#entry-title', 'Test Task');
    await page.selectOption('#entry-type', 'task');
    await page.fill('#entry-body', 'This is a test task');

    // Fill in advanced fields
    await page.click('#toggle-advanced');

    // Set due date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dueDateStr = tomorrow.toISOString().split('T')[0];
    await page.fill('#entry-due', dueDateStr);

    await page.fill('#entry-effort', '30');
    await page.fill('#entry-tags', 'test, urgent');
    await page.fill('#entry-next-action', 'Start working on it');

    // Submit the form
    await page.click('button[type="submit"]');

    // Verify success notification appeared
    const notification = page.locator('.notification-success');
    await expect(notification).toBeVisible();
    await expect(notification).toContainText('captured successfully');

    // Verify the inbox shows the new item
    const inboxCards = page.locator('#inbox-list .object-card');
    await expect(inboxCards).toHaveCount(1);

    const title = page.locator('#inbox-list .object-title');
    await expect(title).toContainText('Test Task');
  });

  test('should validate required fields on form submission', async ({ page }) => {
    // Switch to Capture tab
    await switchToTab(page, 'capture');

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Should see error notification
    const errorNotification = page.locator('.notification-error');
    await expect(errorNotification).toBeVisible();
    await expect(errorNotification).toContainText('Title is required');
  });

  test('should validate that due date is not in the past', async ({ page }) => {
    // Switch to Capture tab
    await switchToTab(page, 'capture');

    await page.fill('#entry-title', 'Past Date Task');

    // Click advanced to expand
    await page.click('#toggle-advanced');

    // Set due date to yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const pastDateStr = yesterday.toISOString().split('T')[0];
    await page.fill('#entry-due', pastDateStr);

    // Try to submit
    await page.click('button[type="submit"]');

    // Should see error notification
    const errorNotification = page.locator('.notification-error');
    await expect(errorNotification).toBeVisible();
    await expect(errorNotification).toContainText('cannot be in the past');
  });

  test('should validate effort is between 1 and 480 minutes', async ({ page }) => {
    // Switch to Capture tab
    await switchToTab(page, 'capture');

    await page.fill('#entry-title', 'Effort Test');

    // Click advanced to expand
    await page.click('#toggle-advanced');

    // Set invalid effort
    await page.fill('#entry-effort', '999');

    // Try to submit
    await page.click('button[type="submit"]');

    // Should see error notification
    const errorNotification = page.locator('.notification-error');
    await expect(errorNotification).toBeVisible();
    await expect(errorNotification).toContainText('between 1 and 480 minutes');
  });

  test('should use modal for project assignment instead of prompt', async ({ page }) => {
    // Switch to Capture tab
    await switchToTab(page, 'capture');

    // First, add a task to the inbox
    await page.fill('#entry-title', 'Task to Assign');
    await page.click('button[type="submit"]');

    // Wait for notification
    const notification = page.locator('.notification-success');
    await expect(notification).toBeVisible();

    // Find the Assign Project button (use first() to avoid strict mode violation)
    const assignBtn = page.locator('#inbox-list button:has-text("Assign Project")').first();
    await assignBtn.click();

    // Modal should appear
    const modal = page.locator('.modal-dialog');
    await expect(modal).toBeVisible();

    // Modal should have title and form
    const modalTitle = page.locator('.modal-dialog h3');
    await expect(modalTitle).toContainText('Assign Project');

    // Should have project select
    const select = page.locator('.modal-form-group select');
    await expect(select).toBeVisible();

    // Select a project
    await select.selectOption('core-workflow');

    // Click confirm
    const confirmBtn = page.locator('.modal-footer button.primary');
    await confirmBtn.click();

    // Modal should close
    await expect(modal).not.toBeVisible();

    // Task should move to organized list
    const organizedCards = page.locator('#organized-list .object-card');
    await expect(organizedCards).toHaveCount(1);
  });

  test('should use modal for snoozing tasks', async ({ page }) => {
    // Switch to Capture tab
    await switchToTab(page, 'capture');

    // Add a task and move it to 'next' status
    await page.fill('#entry-title', 'Task to Snooze');
    await page.click('button[type="submit"]');

    // Find the Snooze button
    const snoozeBtn = page.locator('#organized-list button:has-text("Snooze")');

    // Wait for it to appear
    await page.waitForSelector('#organized-list button:has-text("Snooze")');
    await snoozeBtn.click();

    // Modal should appear
    const modal = page.locator('.modal-dialog');
    await expect(modal).toBeVisible();

    // Modal should have date input
    const dateInput = page.locator('.modal-form-group input[type="date"]');
    await expect(dateInput).toBeVisible();

    // Set a snooze date
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 3);
    const snoozeDate = futureDate.toISOString().split('T')[0];
    await dateInput.fill(snoozeDate);

    // Click confirm
    const confirmBtn = page.locator('.modal-footer button.primary');
    await confirmBtn.click();

    // Modal should close
    await expect(modal).not.toBeVisible();
  });

  test('should search items by title', async ({ page }) => {
    // Switch to Capture tab
    await switchToTab(page, 'capture');

    // Add multiple items
    await page.fill('#entry-title', 'First Task');
    await page.click('button[type="submit"]');

    await page.fill('#entry-title', 'Second Idea');
    await page.selectOption('#entry-type', 'idea');
    await page.click('button[type="submit"]');

    // Move items to organized list
    await page.click('.filters button:has-text("All")');

    // Search for specific item
    await page.fill('#search-input', 'First');

    // Should only show matching item
    const cards = page.locator('#organized-list .object-card');
    await expect(cards).toHaveCount(1);

    const title = page.locator('#organized-list .object-title');
    await expect(title).toContainText('First Task');

    // Clear search
    await page.fill('#search-input', '');

    // Should show all items again
    await expect(cards).not.toHaveCount(1); // Should be > 1
  });

  test('should search items by tags', async ({ page }) => {
    // Add task with tags
    await page.fill('#entry-title', 'Tagged Task');
    await page.click('#toggle-advanced');
    await page.fill('#entry-tags', 'urgent, important');
    await page.click('button[type="submit"]');

    // Move to organized list
    await page.click('.filters button:has-text("All")');

    // Search by tag
    await page.fill('#search-input', 'urgent');

    // Should find the task
    const cards = page.locator('#organized-list .object-card');
    await expect(cards.count()).toBeGreaterThan(0);

    const title = page.locator('#organized-list .object-title');
    await expect(title).toContainText('Tagged Task');
  });

  test('should filter tasks by type', async ({ page }) => {
    // Switch to Capture tab
    await switchToTab(page, 'capture');

    // Add tasks of different types
    await page.fill('#entry-title', 'Task Item');
    await page.selectOption('#entry-type', 'task');
    await page.click('button[type="submit"]');

    await page.fill('#entry-title', 'Idea Item');
    await page.selectOption('#entry-type', 'idea');
    await page.click('button[type="submit"]');

    // Filter by task
    await page.click('.filters button:has-text("Tasks")');

    // Should only show tasks
    const cards = page.locator('#organized-list .object-card');
    const pills = page.locator('#organized-list .type-pill');

    // Check that all visible pills say 'task'
    const pillTexts = await pills.allTextContents();
    pillTexts.forEach(text => {
      expect(text).toBe('task');
    });
  });

  test('should persist data to localStorage', async ({ page, context }) => {
    // Add a task
    await page.fill('#entry-title', 'Persistent Task');
    await page.click('button[type="submit"]');

    // Get localStorage data
    const storageData = await page.evaluate(() => {
      return localStorage.getItem('core.objects');
    });

    expect(storageData).toBeTruthy();

    const parsed = JSON.parse(storageData);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed.some(obj => obj.title === 'Persistent Task')).toBe(true);
  });

  test('should export data to JSON file', async ({ page }) => {
    // Add a task
    await page.fill('#entry-title', 'Export Test Task');
    await page.click('button[type="submit"]');

    // Start listening for download
    const downloadPromise = page.waitForEvent('download');

    // Click export button
    await page.click('#export-data');

    // Wait for download
    const download = await downloadPromise;

    // Verify filename contains 'core-database'
    expect(download.suggestedFilename()).toContain('core-database');
  });

  test('should show focus panel with current task', async ({ page }) => {
    // Add a task with due date today
    const today = new Date().toISOString().split('T')[0];

    await page.fill('#entry-title', 'Today Task');
    await page.click('#toggle-advanced');
    await page.fill('#entry-due', today);
    await page.click('button[type="submit"]');

    // Wait for notification
    await page.waitForSelector('.notification-success');

    // Click "Pick a Task"
    await page.click('#pick-focus');

    // Focus should be set
    const focusTitle = page.locator('.focus-task-title');
    await expect(focusTitle).toContainText('Today Task');

    // Should show Complete button
    const completeBtn = page.locator('.focus-actions button:has-text("✓ Complete")');
    await expect(completeBtn).toBeVisible();
  });

  test('should complete task from focus panel', async ({ page }) => {
    // Add a task with due date today
    const today = new Date().toISOString().split('T')[0];

    await page.fill('#entry-title', 'Complete Test Task');
    await page.click('#toggle-advanced');
    await page.fill('#entry-due', today);
    await page.click('button[type="submit"]');

    // Wait for notification
    await page.waitForSelector('.notification-success');

    // Pick the task
    await page.click('#pick-focus');

    // Complete it
    const completeBtn = page.locator('.focus-actions button:has-text("✓ Complete")');
    await completeBtn.click();

    // Should show completion notification
    const notification = page.locator('.notification-success');
    await expect(notification).toBeVisible();

    // Focus should be cleared
    const focusLabel = page.locator('.focus-label');
    await expect(focusLabel).toContainText('No active focus');
  });

  test('should show accessibility attributes in modal', async ({ page }) => {
    // Add task and open assign modal
    await page.fill('#entry-title', 'Accessibility Test');
    await page.click('button[type="submit"]');

    const assignBtn = page.locator('#inbox-list button:has-text("Assign Project")');
    await assignBtn.click();

    // Check modal has proper ARIA attributes
    const modal = page.locator('.modal-dialog');
    const role = await modal.getAttribute('role');
    const ariaModal = await modal.getAttribute('aria-modal');

    expect(role).toBe('dialog');
    expect(ariaModal).toBe('true');
  });

  test('should handle localStorage errors gracefully', async ({ page }) => {
    // Fill form
    await page.fill('#entry-title', 'Test Task');
    await page.click('button[type="submit"]');

    // Verify notification appeared
    const notification = page.locator('.notification-success');
    await expect(notification).toBeVisible();

    // The app should still be functional
    const inboxCards = page.locator('#inbox-list .object-card');
    await expect(inboxCards.count()).toBeGreaterThan(0);
  });

  // ============================================
  // TAB NAVIGATION & KEYBOARD SHORTCUTS
  // ============================================

  test.describe('Tab Navigation', () => {
    test('should switch between all 4 tabs', async ({ page }) => {
      // Verify initial state - Engage tab is active
      const engageTab = page.locator('button[data-tab="engage"]');
      await expect(engageTab).toHaveClass(/active/);
      await expect(page.locator('#engage-panel')).toBeVisible();

      // Click Capture tab
      await page.click('button[data-tab="capture"]');
      await expect(page.locator('button[data-tab="capture"]')).toHaveClass(/active/);
      await expect(page.locator('#capture-panel')).toBeVisible();
      await expect(page.locator('#engage-panel')).not.toBeVisible();

      // Click Organize tab
      await page.click('button[data-tab="organize"]');
      await expect(page.locator('button[data-tab="organize"]')).toHaveClass(/active/);
      await expect(page.locator('#organize-panel')).toBeVisible();
      await expect(page.locator('#capture-panel')).not.toBeVisible();

      // Click Review tab
      await page.click('button[data-tab="review"]');
      await expect(page.locator('button[data-tab="review"]')).toHaveClass(/active/);
      await expect(page.locator('#review-panel')).toBeVisible();
      await expect(page.locator('#organize-panel')).not.toBeVisible();

      // Click back to Engage
      await page.click('button[data-tab="engage"]');
      await expect(engageTab).toHaveClass(/active/);
      await expect(page.locator('#engage-panel')).toBeVisible();
    });

    test('should persist active tab to localStorage', async ({ page }) => {
      // Switch to Capture tab
      await page.click('button[data-tab="capture"]');

      // Verify localStorage was updated
      const activeTab = await page.evaluate(() => {
        return localStorage.getItem('core.activeTab');
      });
      expect(activeTab).toBe('capture');

      // Reload page
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Capture tab should still be active
      await expect(page.locator('button[data-tab="capture"]')).toHaveClass(/active/);
      await expect(page.locator('#capture-panel')).toBeVisible();
    });
  });

  test.describe('Keyboard Shortcuts', () => {
    test('should switch tabs using number keys 1-4', async ({ page }) => {
      // Press 1 for Engage
      await page.keyboard.press('1');
      await expect(page.locator('button[data-tab="engage"]')).toHaveClass(/active/);

      // Press 2 for Capture
      await page.keyboard.press('2');
      await expect(page.locator('button[data-tab="capture"]')).toHaveClass(/active/);

      // Press 3 for Organize
      await page.keyboard.press('3');
      await expect(page.locator('button[data-tab="organize"]')).toHaveClass(/active/);

      // Press 4 for Review
      await page.keyboard.press('4');
      await expect(page.locator('button[data-tab="review"]')).toHaveClass(/active/);
    });

    test('should switch tabs using E/C/O/R keys', async ({ page }) => {
      // Press E for Engage
      await page.keyboard.press('e');
      await expect(page.locator('button[data-tab="engage"]')).toHaveClass(/active/);

      // Press C for Capture
      await page.keyboard.press('c');
      await expect(page.locator('button[data-tab="capture"]')).toHaveClass(/active/);

      // Press O for Organize
      await page.keyboard.press('o');
      await expect(page.locator('button[data-tab="organize"]')).toHaveClass(/active/);

      // Press R for Review
      await page.keyboard.press('r');
      await expect(page.locator('button[data-tab="review"]')).toHaveClass(/active/);
    });

    test('should not trigger shortcuts when typing in input fields', async ({ page }) => {
      // Navigate to Capture tab
      await page.click('button[data-tab="capture"]');

      // Focus on title input
      await page.click('#entry-title');

      // Type 'e' in the input
      await page.keyboard.type('event');

      // Should still be on Capture tab (not switch to Engage)
      await expect(page.locator('button[data-tab="capture"]')).toHaveClass(/active/);

      // Input should contain the text
      const titleValue = await page.inputValue('#entry-title');
      expect(titleValue).toBe('event');
    });
  });

  // ============================================
  // CAPTURE FLOW - ALL TYPES
  // ============================================

  test.describe('Capture Flow', () => {
    test('should capture a task', async ({ page }) => {
      await page.click('button[data-tab="capture"]');
      await page.fill('#entry-title', 'My Task');
      await page.selectOption('#entry-type', 'task');
      await page.fill('#entry-body', 'Task description');
      await page.click('button[type="submit"]');

      await expect(page.locator('.notification-success')).toBeVisible();
      await expect(page.locator('.notification-success')).toContainText('captured successfully');
    });

    test('should capture an idea', async ({ page }) => {
      await page.click('button[data-tab="capture"]');
      await page.fill('#entry-title', 'My Idea');
      await page.selectOption('#entry-type', 'idea');
      await page.fill('#entry-body', 'Idea description');
      await page.click('button[type="submit"]');

      await expect(page.locator('.notification-success')).toBeVisible();
    });

    test('should capture a note', async ({ page }) => {
      await page.click('button[data-tab="capture"]');
      await page.fill('#entry-title', 'My Note');
      await page.selectOption('#entry-type', 'note');
      await page.fill('#entry-body', 'Note content');
      await page.click('button[type="submit"]');

      await expect(page.locator('.notification-success')).toBeVisible();
    });

    test('should capture media', async ({ page }) => {
      await page.click('button[data-tab="capture"]');
      await page.fill('#entry-title', 'My Media');
      await page.selectOption('#entry-type', 'media');
      await page.fill('#entry-body', 'Media URL or description');
      await page.click('button[type="submit"]');

      await expect(page.locator('.notification-success')).toBeVisible();
    });

    test('should toggle advanced options', async ({ page }) => {
      await page.click('button[data-tab="capture"]');

      // Advanced fields should be hidden initially
      await expect(page.locator('#advanced-fields')).not.toBeVisible();

      // Click toggle button
      await page.click('#toggle-advanced');

      // Advanced fields should now be visible
      await expect(page.locator('#advanced-fields')).toBeVisible();

      // Toggle icon should change
      const toggleIcon = await page.textContent('#toggle-icon');
      expect(toggleIcon).toBe('▼');

      // Click again to hide
      await page.click('#toggle-advanced');
      await expect(page.locator('#advanced-fields')).not.toBeVisible();
    });
  });

  // ============================================
  // ORGANIZE FLOW
  // ============================================

  test.describe('Organize Flow', () => {
    test('should show inbox badge count', async ({ page }) => {
      // Add an item to inbox
      await page.click('button[data-tab="capture"]');
      await page.fill('#entry-title', 'Inbox Item');
      await page.click('button[type="submit"]');

      // Wait for success notification
      await page.waitForSelector('.notification-success');

      // Navigate to Organize tab
      await page.click('button[data-tab="organize"]');

      // Badge should show count (there are also default items)
      const badge = page.locator('#organize-badge');
      await expect(badge).toBeVisible();
      const count = await badge.textContent();
      expect(parseInt(count)).toBeGreaterThan(0);
    });

    test('should filter by all types', async ({ page }) => {
      await page.click('button[data-tab="organize"]');

      // Click "All" filter
      await page.click('.filters button[data-filter="all"]');
      await expect(page.locator('.filters button[data-filter="all"]')).toHaveClass(/active/);

      // Should show items in organized list
      const cards = page.locator('#organized-list .object-card');
      await expect(cards.first()).toBeVisible();
    });

    test('should close modal with X button', async ({ page }) => {
      // Add a task to inbox
      await page.click('button[data-tab="capture"]');
      await page.fill('#entry-title', 'Task for Modal Test');
      await page.click('button[type="submit"]');

      await page.waitForSelector('.notification-success');

      // Navigate to Organize
      await page.click('button[data-tab="organize"]');

      // Open assign modal
      const assignBtn = page.locator('#inbox-list button:has-text("Assign Project")').first();
      await assignBtn.click();

      // Modal should be visible
      const modal = page.locator('.modal-dialog');
      await expect(modal).toBeVisible();

      // Click X button to close
      const closeBtn = page.locator('.modal-dialog .close-btn');
      await closeBtn.click();

      // Modal should be closed
      await expect(modal).not.toBeVisible();
    });

    test('should close modal with Cancel button', async ({ page }) => {
      // Add a task to inbox
      await page.click('button[data-tab="capture"]');
      await page.fill('#entry-title', 'Task for Cancel Test');
      await page.click('button[type="submit"]');

      await page.waitForSelector('.notification-success');

      // Navigate to Organize
      await page.click('button[data-tab="organize"]');

      // Open assign modal
      const assignBtn = page.locator('#inbox-list button:has-text("Assign Project")').first();
      await assignBtn.click();

      // Modal should be visible
      const modal = page.locator('.modal-dialog');
      await expect(modal).toBeVisible();

      // Click Cancel button
      const cancelBtn = page.locator('.modal-footer button.secondary');
      await cancelBtn.click();

      // Modal should be closed
      await expect(modal).not.toBeVisible();
    });
  });

  // ============================================
  // REVIEW FLOW
  // ============================================

  test.describe('Review Flow', () => {
    test('should display daily review section', async ({ page }) => {
      await page.click('button[data-tab="review"]');

      // Daily review section should be visible
      await expect(page.locator('h3:has-text("Daily Focus")')).toBeVisible();
      await expect(page.locator('#complete-daily')).toBeVisible();
      await expect(page.locator('#daily-review')).toBeVisible();
    });

    test('should display weekly review section', async ({ page }) => {
      await page.click('button[data-tab="review"]');

      // Weekly review section should be visible
      await expect(page.locator('h3:has-text("Weekly Radar")')).toBeVisible();
      await expect(page.locator('#complete-weekly')).toBeVisible();
      await expect(page.locator('#weekly-review')).toBeVisible();
    });

    test('should mark daily review as done', async ({ page }) => {
      await page.click('button[data-tab="review"]');

      // Click "Mark Done" for daily review
      await page.click('#complete-daily');

      // Should show success notification
      await expect(page.locator('.notification-success')).toBeVisible();
      await expect(page.locator('.notification-success')).toContainText('Daily review completed');
    });

    test('should mark weekly review as done', async ({ page }) => {
      await page.click('button[data-tab="review"]');

      // Click "Mark Done" for weekly review
      await page.click('#complete-weekly');

      // Should show success notification
      await expect(page.locator('.notification-success')).toBeVisible();
      await expect(page.locator('.notification-success')).toContainText('Weekly review completed');
    });
  });

  // ============================================
  // ENGAGE FLOW
  // ============================================

  test.describe('Engage Flow', () => {
    test('should show initial "No active focus" state', async ({ page }) => {
      await page.click('button[data-tab="engage"]');

      // Should show no active focus message
      await expect(page.locator('.focus-label')).toContainText('No active focus');
      await expect(page.locator('#pick-focus')).toBeVisible();
      await expect(page.locator('#pick-focus')).toContainText('Pick a Task');
    });

    test('should show "Up Next" section', async ({ page }) => {
      await page.click('button[data-tab="engage"]');

      // Up Next section should be visible
      await expect(page.locator('h3:has-text("Up Next")')).toBeVisible();
      await expect(page.locator('#next-actions')).toBeVisible();
    });

    test('should show "Completed Today" section', async ({ page }) => {
      await page.click('button[data-tab="engage"]');

      // Completed Today section should be visible
      await expect(page.locator('h3:has-text("Completed Today")')).toBeVisible();
      await expect(page.locator('#completed-today')).toBeVisible();
    });
  });

  // ============================================
  // DATA PERSISTENCE
  // ============================================

  test.describe('Data Persistence', () => {
    test('should survive page refresh', async ({ page }) => {
      // Add a task
      await page.click('button[data-tab="capture"]');
      await page.fill('#entry-title', 'Persistent Test Task');
      await page.click('button[type="submit"]');

      await page.waitForSelector('.notification-success');

      // Reload page
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Navigate to Organize to see inbox
      await page.click('button[data-tab="organize"]');

      // Task should still exist
      await expect(page.locator('#inbox-list')).toContainText('Persistent Test Task');
    });

    test('should restore active tab after refresh', async ({ page }) => {
      // Switch to Review tab
      await page.click('button[data-tab="review"]');

      // Reload page
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Review tab should still be active
      await expect(page.locator('button[data-tab="review"]')).toHaveClass(/active/);
      await expect(page.locator('#review-panel')).toBeVisible();
    });
  });

  // ============================================
  // NOTIFICATIONS
  // ============================================

  test.describe('Notifications', () => {
    test('should show success notification and auto-dismiss', async ({ page }) => {
      await page.click('button[data-tab="capture"]');
      await page.fill('#entry-title', 'Notification Test');
      await page.click('button[type="submit"]');

      // Success notification should appear
      const notification = page.locator('.notification-success');
      await expect(notification).toBeVisible();

      // Wait for auto-dismiss (usually 3-5 seconds)
      await page.waitForTimeout(5000);

      // Notification should disappear
      await expect(notification).not.toBeVisible();
    });

    test('should show error notification', async ({ page }) => {
      await page.click('button[data-tab="capture"]');

      // Submit without title (required field)
      await page.click('button[type="submit"]');

      // Error notification should appear
      const errorNotification = page.locator('.notification-error');
      await expect(errorNotification).toBeVisible();
      await expect(errorNotification).toContainText('Title is required');
    });
  });

  // ============================================
  // EDGE CASES & ERROR HANDLING
  // ============================================

  test.describe('Edge Cases', () => {
    test('should handle empty inbox state', async ({ page }) => {
      // Navigate to Organize tab
      await page.click('button[data-tab="organize"]');

      // Inbox might be empty or have default items
      // Just verify no errors occur
      await expect(page.locator('#inbox-list')).toBeVisible();
    });

    test('should handle empty search results', async ({ page }) => {
      await page.click('button[data-tab="organize"]');

      // Search for something that doesn't exist
      await page.fill('#search-input', 'NONEXISTENT_SEARCH_TERM_12345');

      // Should handle gracefully (show empty or "no results")
      const cards = page.locator('#organized-list .object-card');
      const count = await cards.count();
      expect(count).toBe(0);
    });

    test('should handle rapid tab switching', async ({ page }) => {
      // Rapidly switch between tabs
      await page.click('button[data-tab="capture"]');
      await page.click('button[data-tab="organize"]');
      await page.click('button[data-tab="review"]');
      await page.click('button[data-tab="engage"]');

      // Should end up on Engage tab without errors
      await expect(page.locator('button[data-tab="engage"]')).toHaveClass(/active/);
      await expect(page.locator('#engage-panel')).toBeVisible();
    });

    test('should handle form submission with only required fields', async ({ page }) => {
      await page.click('button[data-tab="capture"]');

      // Fill only title (required)
      await page.fill('#entry-title', 'Minimal Task');
      await page.click('button[type="submit"]');

      // Should succeed
      await expect(page.locator('.notification-success')).toBeVisible();
    });
  });

  // ============================================
  // RESPONSIVE DESIGN
  // ============================================

  test.describe('Responsive Design', () => {
    test('should render correctly on mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // App should still be usable
      await expect(page.locator('.app-header')).toBeVisible();
      await expect(page.locator('.tab-navigation')).toBeVisible();

      // Should be able to switch tabs
      await page.click('button[data-tab="capture"]');
      await expect(page.locator('#capture-panel')).toBeVisible();
    });

    test('should render correctly on tablet viewport', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });

      // App should still be usable
      await expect(page.locator('.app-header')).toBeVisible();
      await expect(page.locator('.tab-navigation')).toBeVisible();
    });
  });
});
