import type { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly loginEmailInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginButton: Locator;
  readonly loginErrorMessage: Locator;

  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupButton: Locator;

  constructor(page: Page) {
    super(page);
    this.loginEmailInput = page.getByTestId('login-email');
    this.loginPasswordInput = page.getByTestId('login-password');
    this.loginButton = page.getByTestId('login-button');
    this.loginErrorMessage = page.getByText('Your email or password is incorrect!');

    this.signupNameInput = page.getByTestId('signup-name');
    this.signupEmailInput = page.getByTestId('signup-email');
    this.signupButton = page.getByTestId('signup-button');
  }

  async goto(): Promise<void> {
    await super.goto('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginButton.click();
  }

  async signup(name: string, email: string): Promise<void> {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }
}
