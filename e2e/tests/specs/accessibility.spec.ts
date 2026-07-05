import { test, expect } from '../support/fixtures';
import { HomePage } from '../pages/home.page';
import { ProductsPage } from '../pages/products.page';
import { CartPage } from '../pages/cart.page';
import { runAccessibilityScan, reportAccessibility } from '../helpers/accessibility.helper';

test.describe('Accessibility', { tag: '@accessibility' }, () => {
  test('home page stays within the known accessibility baseline', async ({ page }, testInfo) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    const results = await runAccessibilityScan(page, testInfo, 'home');
    reportAccessibility(results, testInfo, 'home');
  });

  test('products page stays within the known accessibility baseline', async ({
    page,
  }, testInfo) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto();

    const results = await runAccessibilityScan(page, testInfo, 'products');
    reportAccessibility(results, testInfo, 'products');
  });

  test('cart page stays within the known accessibility baseline', async ({ page }, testInfo) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto();
    await productsPage.addFirstProductToCart();
    await expect(productsPage.continueShoppingButton).toBeVisible();
    await productsPage.continueShoppingButton.click();

    const cartPage = new CartPage(page);
    await cartPage.goto();

    const results = await runAccessibilityScan(page, testInfo, 'cart');
    reportAccessibility(results, testInfo, 'cart');
  });
});
