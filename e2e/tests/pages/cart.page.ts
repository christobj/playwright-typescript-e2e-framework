import type { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from '../components/header.component';

export class CartPage extends BasePage {
  readonly header: HeaderComponent;
  readonly cartRows: Locator;
  readonly proceedToCheckoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.cartRows = page.locator('#cart_info_table tbody tr');
    // This anchor has no href, so it carries no implicit link role -- match on text instead.
    this.proceedToCheckoutButton = page.getByText('Proceed To Checkout');
  }

  async goto(): Promise<void> {
    await super.goto('/view_cart');
  }

  rowByProductName(name: string): Locator {
    return this.cartRows.filter({ hasText: name });
  }

  async removeProduct(name: string): Promise<void> {
    await this.rowByProductName(name).locator('.cart_quantity_delete').click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.proceedToCheckoutButton.click();
  }
}
