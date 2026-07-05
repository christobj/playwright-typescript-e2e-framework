import { test, expect } from '../support/fixtures';
import { HomePage } from '../pages/home.page';
import { ProductsPage } from '../pages/products.page';

test.describe('Product Search', () => {
  test('returns matching results for a search keyword', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    const productsPage = new ProductsPage(page);
    await productsPage.goto();
    await productsPage.search('Dress');

    await expect(productsPage.searchedProductsHeading).toContainText('Searched Products');

    const names = await productsPage.productNames.allTextContents();
    expect(names.length).toBeGreaterThan(0);
    expect(names.some((name) => name.toLowerCase().includes('dress'))).toBe(true);
  });

  test('opens the product details page when viewing a product', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    const productsPage = new ProductsPage(page);
    await productsPage.goto();
    await productsPage.viewFirstProduct();

    await expect(page).toHaveURL(/\/product_details\//);
  });
});
