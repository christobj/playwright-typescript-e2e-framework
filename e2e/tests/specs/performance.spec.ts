import { test } from '@playwright/test';
import { runLighthouseAudit } from '../helpers/lighthouse.helper';

test.describe('Performance', { tag: '@performance' }, () => {
  test.skip(
    ({ browserName }) => browserName !== 'chromium',
    'Lighthouse requires Chromium DevTools Protocol'
  );

  test('home page meets performance thresholds', async ({ baseURL }) => {
    await runLighthouseAudit(`${baseURL}/`);
  });

  test('products page meets performance thresholds', async ({ baseURL }) => {
    await runLighthouseAudit(`${baseURL}/products`);
  });
});
