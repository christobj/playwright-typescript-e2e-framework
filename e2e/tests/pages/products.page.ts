import type { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from '../components/header.component';

export class ProductsPage extends BasePage {
  readonly header: HeaderComponent;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchedProductsHeading: Locator;
  readonly productCards: Locator;
  readonly productNames: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.searchInput = page.getByPlaceholder('Search Product');
    this.searchButton = page.locator('#submit_search');
    this.searchedProductsHeading = page.getByRole('heading', { name: 'Searched Products' });
    this.productCards = page.locator('.features_items .product-image-wrapper');
    this.productNames = this.productCards.locator('.productinfo p');
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
  }

  async goto(): Promise<void> {
    await super.goto('/products');
  }

  async search(keyword: string): Promise<void> {
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
  }

  async addFirstProductToCart(): Promise<void> {
    const card = this.productCards.first();
    await card.hover();
    // This anchor has no href, so it carries no implicit link role -- match on text instead.
    await card.getByText('Add to cart').first().click();
  }

  async viewFirstProduct(): Promise<void> {
    const card = this.productCards.first();
    await card.hover();
    await Promise.all([
      this.page.waitForURL(/\/product_details\//),
      card.getByRole('link', { name: 'View Product' }).click(),
    ]);
  }
}
