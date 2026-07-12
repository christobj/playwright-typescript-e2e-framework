# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Pure Playwright + TypeScript E2E framework (`@playwright/test`, no BDD layer) targeting [automationexercise.com](https://automationexercise.com/), a public demo e-commerce site. No backend/app code lives here — this repo is the test suite itself.

## Commands

```bash
npm test                        # all specs, chromium/firefox/webkit
npm run test:chromium           # single browser
npm run test:headed             # headed mode
npm run test:debug              # Playwright inspector

npx playwright test <file>                        # single spec file
npx playwright test <file> -g "test name"          # single test by title
npx playwright test --grep "@accessibility|@performance"  # by tag, see Tags below

npm run test:accessibility      # axe-core scan (home/products/cart)
npm run test:performance        # Lighthouse audit, chromium only (needs CDP)
npm run test:visual             # visual regression vs committed baselines
npm run test:visual:update      # regenerate baselines locally

npm run typecheck               # tsc --noEmit
npm run lint / lint.fix
npm run format / format.fix
npm run report:open             # open last HTML report
```

Husky's `pre-commit` hook runs `npm run lint && npm run format` — don't bypass with `--no-verify`.

## Architecture

Page Object Model under `e2e/tests/`:

- `pages/` — one class per page, extends `pages/base.page.ts`. `BasePage.goto()` handles a site interstitial (`waitPastInterstitial()`) that occasionally shows a "One moment, please..." title before redirecting; all page navigation should go through it rather than calling `page.goto()` directly.
- `components/` — shared cross-page UI (e.g. `header.component.ts`), composed into page objects as properties (e.g. `HomePage.header`).
- `support/fixtures.ts` — extends the base `test` with a `testData` fixture (a mutable per-test bag for things like the generated user) and a `page` fixture that aborts ad-network requests (`doubleclick.net`, `googlesyndication.com`, etc.) — the site's Google Vignette ad otherwise hijacks outbound link clicks mid-test. Specs import `test`/`expect` from `support/fixtures`, not `@playwright/test`, directly.
- `support/auth.helper.ts` — `registerNewUser()`, the shared "create a new account" flow used by both `register-login.spec.ts` and `checkout.spec.ts`.
- `utils/data.util.ts` — `generateUser()` builds fake user data via `@faker-js/faker`.
- `helpers/accessibility.helper.ts` / `helpers/lighthouse.helper.ts` — wrap `@axe-core/playwright` and `playwright-lighthouse` respectively; thresholds/config live in these files, not the specs.
- `specs/` — one `*.spec.ts` per feature area, consumes the above.

### Locator conventions (site-specific quirks, see README "Notes on locators")

- "Add to cart" / "Proceed To Checkout" are anchors without `href` (no implicit `link` role) — use `getByText()`, not `getByRole('link', ...)`.
- Login/signup/account-info/payment fields use `getByTestId()` against the site's own `data-qa` attributes (`testIdAttribute: 'data-qa'` in `playwright.config.ts`), not `getByLabel()` — several fields lack a `<label>` entirely, and the zipcode label incorrectly points at the city input.
- Locators must be verified against the live DOM, not assumed.

### Visual regression

Screenshots are OS+browser-specific (Playwright appends e.g. `-darwin`/`-linux` to filenames), so local macOS runs and CI (`ubuntu-latest`) baselines coexist in the same `*-snapshots/` folder without conflict. To refresh the CI-valid (`-linux`) baselines, use **Actions → Update Visual Baselines → Run workflow** (`.github/workflows/update-visual-baselines.yml`) rather than committing baselines generated locally on macOS — do this any time you intentionally change the UI. `maxDiffPixelRatio: 0.02` tolerance is set in `playwright.config.ts` to absorb minor ad/carousel drift.

### Tags

`accessibility.spec.ts`, `performance.spec.ts`, `visual.spec.ts` tag their `describe` blocks (`@accessibility`, `@performance`, `@visual`) for `--grep`/`--grep-invert` selection.

### CI

`.github/workflows/e2e-tests.yml` runs on push/PR to `main`, daily at 03:00 UTC, and manual dispatch (browser choice). `tsc --noEmit` runs before tests; HTML report (traces + screenshots on failure) is uploaded as an artifact on every run.

## Environment

`.env` (gitignored, copy from `.env.example`): `BASE_URL`, `HEADLESS`, optional `BROWSERSTACK_USERNAME`/`BROWSERSTACK_ACCESS_KEY` for the BrowserStack scaffold (`browserstack.yml`, `npm run test:browserstack`) — not wired to a live account by default.

## Branching

GitHub Flow off `main`: `feature/<desc>`, `fix/<desc>`, `chore/<desc>`. PR into `main`, CI must pass, squash merge.
