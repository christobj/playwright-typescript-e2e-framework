# Playwright + TypeScript E2E Test Automation Framework

[![E2E Tests](https://github.com/christobj/playwright-typescript-e2e-framework/actions/workflows/e2e-tests.yml/badge.svg)](https://github.com/christobj/playwright-typescript-e2e-framework/actions/workflows/e2e-tests.yml)

## 📌 Overview

End-to-end test automation framework built with pure **Playwright + TypeScript** (`@playwright/test`, no BDD layer) targeting [automationexercise.com](https://automationexercise.com/), a public demo e-commerce site.

## 🛠️ Tech Stack

- **Playwright** (`@playwright/test`) — browser automation and test runner
- **TypeScript** — test scripting language, `strict` mode
- **`@playwright/test`'s own `expect()`** — web-first, auto-retrying assertions, incl. `toHaveScreenshot()` for visual regression
- **`@axe-core/playwright`** — accessibility scanning (WCAG 2.0/2.1 A & AA)
- **`playwright-lighthouse`** — Lighthouse performance/SEO/best-practices audits
- **`browserstack-node-sdk`** — cross-browser/device cloud runs (scaffolded, see below)
- **ESLint (`typescript-eslint`) & Prettier** — linting and formatting
- **Husky** — git hooks

## 📁 Project Structure

```
e2e/
  tests/
    components/         # Shared UI components (e.g. header/nav)
    utils/               # Test data generation
    pages/               # Page objects
    helpers/             # Accessibility & Lighthouse audit helpers
    specs/               # *.spec.ts test files
    support/             # Custom fixtures + shared auth helper
.github/workflows/       # CI pipeline (GitHub Actions)
browserstack.yml          # BrowserStack cross-browser scaffold (see below)
.env.example             # Committed template for local .env
tsconfig.json             # TypeScript compiler config
playwright.config.ts      # Playwright projects/reporter config
```

## ⚙️ Installation

```bash
git clone <repo-url>
cd playwright-typescript-e2e-framework
npm install
npx playwright install
cp .env.example .env
npm run prepare   # sets up Husky git hooks
```

## 🚀 Running Tests

```bash
npm test                    # all specs, default project (chromium, headless)
npm run test:chromium
npm run test:firefox
npm run test:webkit
npm run test:headed         # headed mode
npm run test:debug          # Playwright inspector
```

Browser selection uses Playwright's native `--project` flag (see `playwright.config.ts`).

## ♿ Accessibility Testing

`e2e/tests/helpers/accessibility.helper.ts` wraps `@axe-core/playwright`, scanning against WCAG 2.0/2.1 A & AA tags. `e2e/tests/specs/accessibility.spec.ts` scans the home, products, and cart pages and fails on any `critical`/`serious` violation (moderate/minor are attached to the test report, not enforced, to avoid noise from third-party ad content on this site).

```bash
npm run test:accessibility
```

## ⚡ Performance Testing (Lighthouse)

`e2e/tests/helpers/lighthouse.helper.ts` launches a dedicated Chromium instance over CDP and runs a Lighthouse audit via `playwright-lighthouse`. `e2e/tests/specs/performance.spec.ts` audits the home and products pages against the thresholds in that helper. Lighthouse requires Chromium's DevTools Protocol, so this spec skips automatically on firefox/webkit projects.

```bash
npm run test:performance
```

Thresholds are intentionally conservative (`performance: 40`) since automationexercise.com is a public demo site with third-party ad content outside this framework's control — tune `PERFORMANCE_THRESHOLDS` in the helper if you point this at a different target.

## 🎨 Visual Regression

`e2e/tests/specs/visual.spec.ts` uses Playwright's built-in `expect(page).toHaveScreenshot()` for the home, products, and cart pages (`maxDiffPixelRatio: 0.02` tolerance, set in `playwright.config.ts`, to absorb minor ad/carousel drift).

```bash
npm run test:visual           # compare against committed baselines
npm run test:visual:update    # (re)generate baselines
```

**Important:** screenshots are pixel comparisons tied to the OS + browser they were taken on — Playwright encodes that into the filename (e.g. `home-chromium-darwin.png` locally on macOS vs. `home-chromium-linux.png` on CI's `ubuntu-latest`), so baselines for both can coexist in the same `*-snapshots/` folder without conflict.

CI-valid (`-linux`) baselines are generated via **Actions → Update Visual Baselines → Run workflow** (`.github/workflows/update-visual-baselines.yml`). It runs on `ubuntu-latest` — the same OS as the main E2E workflow — regenerates snapshots, and opens a PR with the resulting `*-linux.png` files for review. It takes a `browser` input (`all` / `chromium` / `firefox` / `webkit`, default `all`) so you only install and audit the browser(s) you actually need instead of always downloading all three.

Re-run that workflow (no other changes needed) any time you intentionally change the UI — it'll open a fresh PR with updated baselines.

## ☁️ BrowserStack Cross-Browser (scaffold)

`browserstack.yml` scaffolds a BrowserStack device/browser matrix (Windows Chrome, macOS Safari, iPhone) via `browserstack-node-sdk`. **This is not wired to a live account** — add `BROWSERSTACK_USERNAME` / `BROWSERSTACK_ACCESS_KEY` to your `.env` first:

```bash
npm run test:browserstack
```

## 🌍 Environment Configuration

No multi-brand/multi-market setup, since this targets one public site:

```
BASE_URL=https://automationexercise.com
HEADLESS=true

# BrowserStack (optional, see above)
BROWSERSTACK_USERNAME=
BROWSERSTACK_ACCESS_KEY=
```

`.env` is gitignored; `.env.example` is committed as the template.

## 📝 Test Reports

Playwright's own HTML reporter:

```bash
npm run report:open
```

## ✅ CI/CD (GitHub Actions)

`.github/workflows/e2e-tests.yml` runs the suite on every push/PR to `main`, once daily at 03:00 UTC, and on manual dispatch with a browser choice. A `Type check` step (`tsc --noEmit`) runs before the tests. The HTML report (with traces and screenshots on failure) is uploaded as a build artifact on every run, pass or fail. `@visual` runs alongside everything else now that Linux-matched baselines are committed — see [Visual Regression](#-visual-regression).

## 🏷️ Test Tags

`accessibility.spec.ts`, `performance.spec.ts`, and `visual.spec.ts` tag their `describe` blocks (`@accessibility`, `@performance`, `@visual`) so they can be included/excluded via Playwright's `--grep` / `--grep-invert`, e.g. `npx playwright test --grep "@accessibility|@performance"`.

## 🌿 Branching Strategy (GitHub Flow)

- `main` is always in a working, deployable state.
- All work happens on short-lived branches off `main`:
  - `feature/<short-description>` — new tests/functionality
  - `fix/<short-description>` — bug fixes
  - `chore/<short-description>` — tooling/config/docs
- Open a PR into `main`; CI must pass before merging (squash merge recommended).

## 📌 Linting, Formatting & Type Checking

```bash
npm run typecheck    # tsc --noEmit
npm run lint         # check
npm run lint.fix     # auto-fix
npm run format       # check
npm run format.fix    # auto-fix
```

Husky's `pre-commit` hook runs `npm run lint && npm run format` before every commit.

## Notes on locators

All locators here were verified against the live DOM (not assumed), and a couple of site quirks are worth knowing if you extend this suite:

- The "Add to cart" and "Proceed To Checkout" elements are anchors **without** an `href`, so they carry no implicit ARIA `link` role — they're matched with `getByText()`, not `getByRole('link', ...)`.
- Login/signup/account-info/payment fields use `getByTestId()` against the site's own `data-qa` attributes (configured via `use.testIdAttribute` in `playwright.config.ts`) rather than `getByLabel()` — several fields have no `<label>` at all (the payment form), and the zipcode field's label actually points at the city input (`for="city"`) on the live site.
- Requests to Google's ad network (`doubleclick.net`, `googlesyndication.com`, etc.) are aborted via a custom `page` fixture in `support/fixtures.ts`, since the site's Google Vignette ad otherwise hijacks outbound link clicks mid-test.
- `support/auth.helper.ts` centralizes the "register a new user" flow shared by the register/login and checkout specs.

Happy Testing! 🚀
