import { test, expect } from '../support/fixtures';
import { HomePage } from '../pages/home.page';
import { LoginPage } from '../pages/login.page';
import { registerNewUser } from '../support/auth.helper';

test.describe('Registration and Login', () => {
  test('registers a new user successfully', async ({ page, testData }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await registerNewUser(page, testData);

    await expect(homePage.header.loggedInAsText).toBeVisible();
  });

  test('shows an error when logging in with incorrect credentials', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.header.goToSignupLogin();

    const loginPage = new LoginPage(page);
    await loginPage.login('nonexistent.user@example.com', 'wrongPassword123');

    await expect(loginPage.loginErrorMessage).toBeVisible();
  });

  test('returns to logged-out navigation state after logout', async ({ page, testData }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await registerNewUser(page, testData);
    await homePage.header.logout();

    await expect(homePage.header.signupLoginLink).toBeVisible();
  });
});
