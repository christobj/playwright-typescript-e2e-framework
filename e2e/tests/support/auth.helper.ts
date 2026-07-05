import type { Page } from '@playwright/test';
import { expect } from './fixtures';
import type { TestData } from './fixtures';
import { HomePage } from '../pages/home.page';
import { LoginPage } from '../pages/login.page';
import { AccountInformationPage } from '../pages/account_information.page';
import { generateUser } from '../utils/data.util';

export async function registerNewUser(page: Page, testData: TestData): Promise<void> {
  const homePage = new HomePage(page);
  await homePage.header.goToSignupLogin();

  testData.user = generateUser();
  const loginPage = new LoginPage(page);
  await loginPage.signup(testData.user.name, testData.user.email);

  const accountInfoPage = new AccountInformationPage(page);
  await accountInfoPage.fillAccountInformation(testData.user);
  await accountInfoPage.submit();
  await expect(accountInfoPage.accountCreatedHeading).toBeVisible();
  await accountInfoPage.continueToHome();
}
