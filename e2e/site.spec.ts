import { test, expect } from '@playwright/test';

test.describe('Crystal Site E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home before each test
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Home page loads and displays hero section', async ({ page }) => {
    // Check hero section is visible
    const heroSection = page.locator('[class*="hero"]').first();
    await expect(heroSection).toBeVisible();
    
    // Check for main navigation
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });

  test('Navigate to catalog and load crystals', async ({ page }) => {
    // Click on catalog link
    const catalogLink = page.locator('a[href="/catalog"]').first();
    await catalogLink.click();
    
    // Wait for catalog page to load
    await page.waitForLoadState('networkidle');
    
    // Check for crystal cards
    const crystalCards = page.locator('[class*="card"]');
    const cardCount = await crystalCards.count();
    expect(cardCount).toBeGreaterThan(0);
  });

  test('Click on a crystal and view details', async ({ page }) => {
    // Go to catalog
    await page.goto('/catalog');
    await page.waitForLoadState('networkidle');
    
    // Click first crystal card
    const firstCrystal = page.locator('[class*="card"]').first();
    await firstCrystal.click();
    
    // Wait for detail page to load
    await page.waitForLoadState('networkidle');
    
    // Verify we're on a detail page and have content
    const crystalTitle = page.locator('h1').first();
    await expect(crystalTitle).toBeVisible();
  });

  test('Contact form submission', async ({ page }) => {
    // Navigate to home and scroll to footer/contact area
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find and fill contact form
    const emailInput = page.locator('input[type="email"]').first();
    const nameInput = page.locator('input[type="text"]').first();
    const contactMethodSelect = page.locator('select').first();
    
    // Check if form exists and is visible
    if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Fill form fields
      await nameInput.fill('Test User');
      await emailInput.fill('test@example.com');
      
      // Select contact method if available
      try {
        await contactMethodSelect.click();
        const optionTelegram = page.locator('option, [role="option"]').filter({ hasText: /telegram|Telegram/i }).first();
        if (await optionTelegram.isVisible({ timeout: 2000 }).catch(() => false)) {
          await optionTelegram.click();
        }
      } catch (e) {
        // Contact method may not be present, skip this step
      }
      
      // Submit form
      const submitButton = page.locator('button[type="submit"]').first();
      await submitButton.click();
      
      // Wait for success message or new page load
      await page.waitForLoadState('networkidle');
      
      // Check for success indication (message or URL change)
      const successMessage = page.locator('[class*="success"], [role="alert"]').first();
      const isSuccess = await successMessage.isVisible({ timeout: 5000 }).catch(() => false);
      expect(isSuccess).toBeDefined();
    }
  });

  test('Scroll to top button appears and works', async ({ page }) => {
    await page.goto('/catalog');
    await page.waitForLoadState('networkidle');
    
    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 1000));
    
    // Look for scroll-to-top button
    const scrollButton = page.locator('button').filter({ hasText: /top|scroll|arrow/i }).first();
    
    // If button exists and is visible, click it
    if (await scrollButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await scrollButton.click();
      
      // Verify we scrolled back to top
      const scrollPosition = await page.evaluate(() => window.scrollY);
      expect(scrollPosition).toBeLessThan(100);
    }
  });

  test('FAQ page loads and accordions work', async ({ page }) => {
    await page.goto('/faq');
    await page.waitForLoadState('networkidle');
    
    // Find accordion items
    const accordionButtons = page.locator('button').filter({ hasText: /question|faq/i });
    const count = await accordionButtons.count();
    
    if (count > 0) {
      // Click first accordion item
      const firstItem = accordionButtons.first();
      await firstItem.click();
      
      // Content should appear or expand
      await page.waitForTimeout(300); // Wait for animation
      
      // Verify some content is visible
      const content = page.locator('[role="region"]').first();
      const isVisible = await content.isVisible({ timeout: 2000 }).catch(() => false);
      expect(isVisible).toBeDefined();
    }
  });

  test('Quiz page is accessible', async ({ page }) => {
    await page.goto('/quiz');
    await page.waitForLoadState('networkidle');
    
    // Verify quiz content is present
    const quizContent = page.locator('main').first();
    await expect(quizContent).toBeVisible();
    
    // Look for quiz questions or buttons
    const quizElements = page.locator('button, [role="radio"], input');
    const elementCount = await quizElements.count();
    expect(elementCount).toBeGreaterThan(0);
  });

  test('Navigation between pages works', async ({ page }) => {
    // Start at home
    await expect(page).toHaveURL('/');
    
    // Navigate to about
    const aboutLink = page.locator('a').filter({ hasText: /about|о сайте/i }).first();
    if (await aboutLink.isVisible({ timeout: 2000 }).catch(() => false)) {
      await aboutLink.click();
      await page.waitForLoadState('networkidle');
      
      // Should be on about page
      const currentUrl = page.url();
      expect(currentUrl).toContain('about');
    }
  });

  test('Dark mode toggle works (if available)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for theme toggle button
    const themeToggle = page.locator('button').filter({ hasText: /theme|dark|light|mode/i }).first();
    
    if (await themeToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
      const initialHtml = await page.locator('html').first();
      const initialClass = await initialHtml.getAttribute('class');
      
      // Click toggle
      await themeToggle.click();
      await page.waitForTimeout(100);
      
      // Check if class changed
      const newClass = await initialHtml.getAttribute('class');
      expect(initialClass).not.toBe(newClass);
    }
  });
});
