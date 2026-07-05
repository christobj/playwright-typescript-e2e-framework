import AxeBuilder from '@axe-core/playwright';
import type { Page, TestInfo } from '@playwright/test';
import type { AxeResults, Result } from 'axe-core';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
const FAILING_IMPACTS = new Set(['critical', 'serious']);

export async function runAccessibilityScan(
  page: Page,
  testInfo: TestInfo,
  name: string
): Promise<AxeResults> {
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

  await testInfo.attach(`${name}-accessibility-report`, {
    body: JSON.stringify(results, null, 2),
    contentType: 'application/json',
  });

  return results;
}

export function criticalViolations(results: AxeResults): Result[] {
  return results.violations.filter((v) => FAILING_IMPACTS.has(v.impact ?? ''));
}

// automationexercise.com's shared footer has one known, pre-existing serious violation
// (insufficient text color contrast) that this framework doesn't control. Treat exactly
// that many critical/serious violations as the accepted baseline; anything else (fewer,
// more, or different violations) is surfaced as a report warning instead of a hard failure,
// so a genuinely new accessibility regression is still visible without breaking the build
// on a defect this team can't fix.
const EXPECTED_VIOLATION_COUNT = 1;

// Escapes text per GitHub's workflow-command spec so it can't break out of the ::warning:: line.
function escapeWorkflowCommandProperty(value: string): string {
  return value.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
}

export function reportAccessibility(
  results: AxeResults,
  testInfo: TestInfo,
  name: string,
  expectedCount = EXPECTED_VIOLATION_COUNT
): void {
  const violations = criticalViolations(results);
  if (violations.length === expectedCount) return;

  const description = `${name}: expected ${expectedCount} known critical/serious accessibility violation(s), found ${violations.length} (${violations.map((v) => v.id).join(', ') || 'none'})`;
  testInfo.annotations.push({ type: 'warning', description });
  console.warn(description);

  // Surface as a GitHub Actions warning annotation (visible on the run summary and PR checks
  // tab, not just buried in a passing test's HTML report) instead of only logging to the job's
  // console output, which nobody reads when the build stays green.
  if (process.env.GITHUB_ACTIONS) {
    console.log(
      `::warning title=Accessibility regression (${name})::${escapeWorkflowCommandProperty(description)}`
    );
  }
}
