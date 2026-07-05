import { test, expect } from '../support/fixtures';
import { HomePage } from '../pages/home.page';
import { ProductsPage } from '../pages/products.page';
import { CartPage } from '../pages/cart.page';

test.describe('Shopping Cart', () => {
  test('adds the first product to the cart', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    const productsPage = new ProductsPage(page);
    await productsPage.goto();
    await productsPage.addFirstProductToCart();
    await expect(productsPage.continueShoppingButton).toBeVisible();
    await productsPage.continueShoppingButton.click();

    const cartPage = new CartPage(page);
    await cartPage.goto();

    await expect(cartPage.cartRows).toHaveCount(1);
  });

  test('removes a product from the cart', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    const productsPage = new ProductsPage(page);
    await productsPage.goto();
    const productName = (await productsPage.productNames.first().textContent())?.trim() ?? '';
    await productsPage.addFirstProductToCart();
    await expect(productsPage.continueShoppingButton).toBeVisible();
    await productsPage.continueShoppingButton.click();

    const cartPage = new CartPage(page);
    await cartPage.goto();
    await cartPage.removeProduct(productName);

    await expect(cartPage.cartRows).toHaveCount(0);
  });
});
