import type { Page, Locator } from '@playwright/test';

export class HeaderComponent {
  readonly homeLink: Locator;
  readonly productsLink: Locator;
  readonly cartLink: Locator;
  readonly signupLoginLink: Locator;
  readonly logoutLink: Locator;
  readonly loggedInAsText: Locator;

  constructor(private readonly page: Page) {
    const nav = page.locator('.shop-menu');
    this.homeLink = nav.getByRole('link', { name: 'Home' });
    this.productsLink = nav.getByRole('link', { name: 'Products' });
    this.cartLink = nav.getByRole('link', { name: 'Cart' });
    this.signupLoginLink = nav.getByRole('link', { name: 'Signup / Login' });
    this.logoutLink = nav.getByRole('link', { name: 'Logout' });
    this.loggedInAsText = page.getByText(/Logged in as/i);
  }

  async goToProducts(): Promise<void> {
    await this.productsLink.click();
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }

  async goToSignupLogin(): Promise<void> {
    await this.signupLoginLink.click();
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
  }

  async isLoggedIn(): Promise<boolean> {
    return this.loggedInAsText.isVisible();
  }
}
