import { test, expect } from '../support/fixtures';
import { HomePage } from '../pages/home.page';
import { ProductsPage } from '../pages/products.page';
import { CartPage } from '../pages/cart.page';

test.describe('Visual regression', { tag: '@visual' }, () => {
  test('home page matches baseline', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await expect(page).toHaveScreenshot('home.png', { fullPage: true });
  });

  test('products page matches baseline', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto();

    await expect(page).toHaveScreenshot('products.png', { fullPage: true });
  });

  test('cart page matches baseline', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto();
    await productsPage.addFirstProductToCart();
    await expect(productsPage.continueShoppingButton).toBeVisible();
    await productsPage.continueShoppingButton.click();

    const cartPage = new CartPage(page);
    await cartPage.goto();

    await expect(page).toHaveScreenshot('cart.png', { fullPage: true });
  });
});
