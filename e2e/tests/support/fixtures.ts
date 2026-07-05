import { test as base, expect } from '@playwright/test';
import type { UserData } from '../utils/data.util';

export interface TestData {
  user?: UserData;
  productName?: string;
  searchTerm?: string;
}

const AD_NETWORK_PATTERN =
  /doubleclick\.net|googlesyndication\.com|googleadservices\.com|google\.com\/pagead|adservice\.google/i;

export const test = base.extend<{ testData: TestData }>({
  // eslint-disable-next-line no-empty-pattern -- Playwright's fixture signature requires this destructure.
  testData: async ({}, use) => {
    await use({});
  },
  page: async ({ page }, use) => {
    await page.context().route(AD_NETWORK_PATTERN, (route) => route.abort());
    await use(page);
  },
});

export { expect };
