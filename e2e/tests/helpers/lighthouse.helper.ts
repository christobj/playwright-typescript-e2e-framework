import { chromium } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';

const LIGHTHOUSE_CDP_PORT = 9222;

// automationexercise.com is a public demo site laden with third-party ads/mixed content
// outside this framework's control, so these floors are set below its measured scores —
// tight enough to catch a real regression, loose enough not to fail on site noise.
export const PERFORMANCE_THRESHOLDS = {
  performance: 40,
  accessibility: 50,
  'best-practices': 20,
  seo: 50,
};

export async function runLighthouseAudit(url: string): Promise<void> {
  const browser = await chromium.launch({
    args: [`--remote-debugging-port=${LIGHTHOUSE_CDP_PORT}`, '--no-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.goto(url);
    await playAudit({ page, port: LIGHTHOUSE_CDP_PORT, thresholds: PERFORMANCE_THRESHOLDS });
  } finally {
    await browser.close();
  }
}
