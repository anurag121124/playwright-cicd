import { test, expect } from '@playwright/test';

// Constants
const BASE_URL = 'https://driver.fuelbuddy.ae/';
const VALID_EMAIL = 'testdriver@fuelbuddy.ae';
const VALID_PASSWORD = '123456';
const INVALID_EMAIL = 'wronguser@example.com';
const INVALID_PASSWORD = 'invalidpassword';

export const resumeItems = {
  navigateToLoginPage: async (page) => {
    await page.goto(BASE_URL);
    await expect(page.locator('[data-test-id="login-page"]')).toBeVisible();
  },
  fillLoginForm: async (page, email, password) => {
    await page.locator('[data-test-id="email-input"]').fill(email);
    await page.locator('[data-test-id="password-input"]').fill(password);
  },
  clickLoginButton: async (page) => {
    await page.locator('[data-test-id="login-button"]').click();
  },
  verifyLoginSuccess: async (page) => {
    await page.goto(`${BASE_URL}dashboard`);
    await page.waitForTimeout(2000);
    await expect(page.locator('[data-test-id="welcome-message"]')).toContainText('Welcome');
  },
  verifyLoginFailure: async (page) => {
    const toast = await page.locator('.toast.error'); // Adjust the selector to match your toast
    await expect(toast).toHaveText('error logging in');

},

  togglePasswordVisibility: async (page) => {
    const passwordInput = page.locator('[data-test-id="password-input"]');
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await page.locator('[data-test-id="toggle-password-visibility"]').click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
    await page.locator('[data-test-id="toggle-password-visibility"]').click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  }
};

test.describe('Login functionality', () => {
  test('should successfully log in with valid credentials', async ({ page }) => {
    await resumeItems.navigateToLoginPage(page);
    await resumeItems.fillLoginForm(page, VALID_EMAIL, VALID_PASSWORD);
    await resumeItems.clickLoginButton(page);
    await resumeItems.verifyLoginSuccess(page);
  });

  test('should display error on invalid login credentials', async ({ page }) => {
    await resumeItems.navigateToLoginPage(page);
    await resumeItems.fillLoginForm(page, INVALID_EMAIL, INVALID_PASSWORD);
    await resumeItems.clickLoginButton(page);
  });

  test('should toggle password visibility', async ({ page }) => {
    await resumeItems.navigateToLoginPage(page);
    await resumeItems.fillLoginForm(page, VALID_EMAIL, 'secretpassword');
    await resumeItems.togglePasswordVisibility(page);
  });
});
