import AxeBuilder from '@axe-core/playwright';
import type { Page, TestInfo } from '@playwright/test';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
const FAILING_IMPACTS = new Set(['critical', 'serious']);

export async function runAccessibilityScan(page: Page, testInfo: TestInfo, name: string) {
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

  await testInfo.attach(`${name}-accessibility-report`, {
    body: JSON.stringify(results, null, 2),
    contentType: 'application/json',
  });

  return results;
}

export function criticalViolations(results: { violations: { impact?: string | null }[] }) {
  return results.violations.filter((v) => FAILING_IMPACTS.has(v.impact ?? ''));
}
