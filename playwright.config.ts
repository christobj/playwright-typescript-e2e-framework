import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e/tests/specs',
  retries: 1,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL || 'https://automationexercise.com',
    headless: process.env.HEADLESS !== 'false',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    // The site exposes its own test hooks via data-qa; use them as the getByTestId() attribute.
    testIdAttribute: 'data-qa',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: { args: ['--disable-blink-features=AutomationControlled'] },
      },
    },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
