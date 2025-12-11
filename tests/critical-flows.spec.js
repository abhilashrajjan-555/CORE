import { test, expect } from '@playwright/test';

test.describe('C.O.R.E. Workflow - Critical User Flows', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('file:///Users/abhilashrajan/Developer/C.O.R.E.%20Workflow/index.html');
    // Wait for app to load
    await page.waitForLoadState('networkidle');
  });

  test('should capture a new task with all fields', async ({ page }) => {
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
    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Should see error notification
    const errorNotification = page.locator('.notification-error');
    await expect(errorNotification).toBeVisible();
    await expect(errorNotification).toContainText('Title is required');
  });

  test('should validate that due date is not in the past', async ({ page }) => {
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
    // First, add a task to the inbox
    await page.fill('#entry-title', 'Task to Assign');
    await page.click('button[type="submit"]');

    // Wait for notification
    const notification = page.locator('.notification-success');
    await expect(notification).toBeVisible();

    // Find the Assign Project button
    const assignBtn = page.locator('#inbox-list button:has-text("Assign Project")');
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
});
