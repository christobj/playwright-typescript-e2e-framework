import { test, expect } from '../support/fixtures';
import { HomePage } from '../pages/home.page';
import { ProductsPage } from '../pages/products.page';
import { CartPage } from '../pages/cart.page';
import { runAccessibilityScan, criticalViolations } from '../helpers/accessibility.helper';

test.describe('Accessibility', { tag: '@accessibility' }, () => {
  test('home page has no critical/serious violations', async ({ page }, testInfo) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    const results = await runAccessibilityScan(page, testInfo, 'home');
    expect(criticalViolations(results), JSON.stringify(results.violations, null, 2)).toEqual([]);
  });

  test('products page has no critical/serious violations', async ({ page }, testInfo) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto();

    const results = await runAccessibilityScan(page, testInfo, 'products');
    expect(criticalViolations(results), JSON.stringify(results.violations, null, 2)).toEqual([]);
  });

  test('cart page has no critical/serious violations', async ({ page }, testInfo) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto();
    await productsPage.addFirstProductToCart();
    await expect(productsPage.continueShoppingButton).toBeVisible();
    await productsPage.continueShoppingButton.click();

    const cartPage = new CartPage(page);
    await cartPage.goto();

    const results = await runAccessibilityScan(page, testInfo, 'cart');
    expect(criticalViolations(results), JSON.stringify(results.violations, null, 2)).toEqual([]);
  });
});
