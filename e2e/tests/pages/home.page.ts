import type { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from '../components/header.component';

export class HomePage extends BasePage {
  readonly header: HeaderComponent;
  readonly subscribeEmailInput: Locator;
  readonly subscribeButton: Locator;
  readonly subscribeSuccessMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.subscribeEmailInput = page.getByPlaceholder('Your email address');
    this.subscribeButton = page.locator('#subscribe');
    this.subscribeSuccessMessage = page.getByText(/successfully subscribed/i);
  }

  async goto(): Promise<void> {
    await super.goto('/');
  }

  async subscribe(email: string): Promise<void> {
    await this.subscribeEmailInput.scrollIntoViewIfNeeded();
    await this.subscribeEmailInput.fill(email);
    await this.subscribeButton.click();
  }
}
