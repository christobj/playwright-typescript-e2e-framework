import type { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import type { UserData } from '../utils/data.util';

export class AccountInformationPage extends BasePage {
  // Both title radios share data-qa="title", so getByTestId can't disambiguate them; use the id.
  readonly titleMr: Locator;
  readonly passwordInput: Locator;
  readonly daysSelect: Locator;
  readonly monthsSelect: Locator;
  readonly yearsSelect: Locator;
  readonly newsletterCheckbox: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly companyInput: Locator;
  readonly address1Input: Locator;
  readonly address2Input: Locator;
  readonly countrySelect: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;
  readonly zipcodeInput: Locator;
  readonly mobileNumberInput: Locator;
  readonly createAccountButton: Locator;
  readonly accountCreatedHeading: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.titleMr = page.locator('#id_gender1');
    this.passwordInput = page.getByTestId('password');
    this.daysSelect = page.getByTestId('days');
    this.monthsSelect = page.getByTestId('months');
    this.yearsSelect = page.getByTestId('years');
    this.newsletterCheckbox = page.getByLabel('Sign up for our newsletter!');
    this.firstNameInput = page.getByTestId('first_name');
    this.lastNameInput = page.getByTestId('last_name');
    this.companyInput = page.getByTestId('company');
    // The address1 field's data-qa value is "address" (not "address1") on the live site.
    this.address1Input = page.getByTestId('address');
    this.address2Input = page.getByTestId('address2');
    this.countrySelect = page.getByTestId('country');
    this.stateInput = page.getByTestId('state');
    this.cityInput = page.getByTestId('city');
    this.zipcodeInput = page.getByTestId('zipcode');
    this.mobileNumberInput = page.getByTestId('mobile_number');
    this.createAccountButton = page.getByTestId('create-account');
    this.accountCreatedHeading = page.getByTestId('account-created');
    this.continueButton = page.getByTestId('continue-button');
  }

  async fillAccountInformation(user: UserData): Promise<void> {
    await this.titleMr.check();
    await this.passwordInput.fill(user.password);
    await this.daysSelect.selectOption(user.dobDay);
    await this.monthsSelect.selectOption({ label: user.dobMonth });
    await this.yearsSelect.selectOption(user.dobYear);
    await this.newsletterCheckbox.check();
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.companyInput.fill(user.company);
    await this.address1Input.fill(user.address1);
    await this.address2Input.fill(user.address2);
    await this.countrySelect.selectOption({ label: user.country });
    await this.stateInput.fill(user.state);
    await this.cityInput.fill(user.city);
    await this.zipcodeInput.fill(user.zipcode);
    await this.mobileNumberInput.fill(user.mobileNumber);
  }

  async submit(): Promise<void> {
    await this.createAccountButton.click();
  }

  async continueToHome(): Promise<void> {
    await this.continueButton.click();
  }
}
