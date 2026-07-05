import type { Page } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path = '/'): Promise<void> {
    await this.page.goto(path);
    await this.waitPastInterstitial();
  }

  async waitPastInterstitial(): Promise<void> {
    const isInterstitial = async () => (await this.page.title()) === 'One moment, please...';
    if (!(await isInterstitial())) return;

    await this.page
      .waitForFunction(() => document.title !== 'One moment, please...', null, {
        timeout: 20000,
      })
      .catch(async () => {
        await this.page.reload();
      });
  }
}
