# Playwright + TypeScript E2E Test Automation Framework

[![E2E Tests](https://github.com/christobj/playwright-typescript-e2e-framework/actions/workflows/e2e-tests.yml/badge.svg)](https://github.com/christobj/playwright-typescript-e2e-framework/actions/workflows/e2e-tests.yml)

## 📌 Overview

End-to-end test automation framework built with pure **Playwright + TypeScript** (`@playwright/test`, no BDD layer) targeting [automationexercise.com](https://automationexercise.com/), a public demo e-commerce site.

## 🛠️ Tech Stack

- **Playwright** (`@playwright/test`) — browser automation and test runner
- **TypeScript** — test scripting language, `strict` mode
- **`@playwright/test`'s own `expect()`** — web-first, auto-retrying assertions
- **ESLint (`typescript-eslint`) & Prettier** — linting and formatting
- **Husky** — git hooks

## 📁 Project Structure

```
e2e/
  tests/
    components/         # Shared UI components (e.g. header/nav)
    utils/               # Test data generation
    pages/               # Page objects
    specs/               # *.spec.ts test files
    support/             # Custom fixtures + shared auth helper
.github/workflows/       # CI pipeline (GitHub Actions)
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

## 🌍 Environment Configuration

Single `.env` file, no multi-brand/multi-market setup, since this targets one public site:

```
BASE_URL=https://automationexercise.com
HEADLESS=true
```

`.env` is gitignored; `.env.example` is committed as the template.

## 📝 Test Reports

Playwright's own HTML reporter:

```bash
npm run report:open
```

## ✅ CI/CD (GitHub Actions)

`.github/workflows/e2e-tests.yml` runs the suite on every push/PR to `main`, once daily at 03:00 UTC, and on manual dispatch with a browser choice. A `Type check` step (`tsc --noEmit`) runs before the tests. The HTML report (with traces and screenshots on failure) is uploaded as a build artifact on every run, pass or fail.

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
