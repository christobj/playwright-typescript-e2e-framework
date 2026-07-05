import { faker } from '@faker-js/faker';
import { test, expect } from '../support/fixtures';
import { HomePage } from '../pages/home.page';

test.describe('Home Page', () => {
  test('loads with all main navigation elements visible', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await expect(page).toHaveTitle(/Automation Exercise/);
    await expect(homePage.header.homeLink).toBeVisible();
    await expect(homePage.header.productsLink).toBeVisible();
    await expect(homePage.header.cartLink).toBeVisible();
    await expect(homePage.header.signupLoginLink).toBeVisible();
  });

  test('accepts a valid email for newsletter subscription', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.subscribe(faker.internet.email());

    await expect(homePage.subscribeSuccessMessage).toContainText('successfully subscribed');
  });
});
