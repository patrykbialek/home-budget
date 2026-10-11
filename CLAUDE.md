# CLAUDE.md

Project guidance for Claude Code working in this repository.

## What this is

**home-budget** — an Angular single-page app for planning and tracking a household
budget by year. Users authenticate (Firebase email/password), then manage two
parallel feature areas: **Plans** (the intended budget) and **Budgets** (actual
execution). Data lives in Firebase **Realtime Database** (not Firestore). UI is in
Polish.

## Tech stack

- **Angular 20.3.30** — classic **NgModule** architecture (components are explicitly
  `standalone: false`; this is deliberate, not a pending migration). Uses modern DI
  (`inject()`) and signals (`toSignal`) within that NgModule structure. zone.js still in use.
- **Build**: classic webpack builder `@angular-devkit/build-angular:browser` (NOT the
  esbuild/`application` builder). Requires `NODE_OPTIONS=--openssl-legacy-provider`.
- **NgRx 20** — store, effects, router-store, store-devtools.
- **@angular/fire 20** — Firebase Auth + Realtime Database. firebase SDK v11.
- **Angular Material 20** + CDK + moment date adapter (`LOCALE_ID` = `pl`).
- **@ngx-translate 18** — i18n files at `src/assets/i18n/{pl,en}.json`, default `pl`.
- **ng2-charts 8 / chart.js 4** — graphs.
- **inuitcss / inuit-flexgrid** — ITCSS-layered SCSS under `src/assets/styles`.
- TypeScript 5.8, target ES2022, `moduleResolution: bundler`.

## Environments & Firebase

| | dev | prod |
|---|---|---|
| env file | `src/environments/environment.ts` | `environment.prod.ts` |
| Firebase project | `plan-budget-test` | `plan-and-budget` (default in `.firebaserc`) |
| `production` flag | `false` | `true` |

- Realtime DB region: `europe-west1`. Hosting serves `./dist` with SPA rewrite to `index.html`.
- DB rules (`database.rules.json`): everything under `/workspaces/$uid` is readable/writable
  only by the owner (`$uid === auth.uid`); `transactions` indexed on `date`, `category_date`.

## Commands

- `nvm use` (Node **22**, see `.nvmrc`) — required for build/test.
- `npm start` → `ng serve` (development configuration, serves against dev Firebase).
- `npm run build` → `ng build` (defaults to **production** configuration).
- `npm test` → `ng test` (Karma + Jasmine). **No Chrome installed** on this machine —
  run headless via Edge: set `CHROME_BIN` to the Edge binary.

## Deploy flow (strict)

Always: **feature branch → merge to `develop` → build → `firebase deploy`.**
Never deploy directly from a feature branch. `master` is the main/prod branch; PRs
usually target `develop`.

## Architecture

By-feature structure under `src/app`. Three lazy-loaded feature modules:
`authentication`, `plans`, `budgets`. Plus `core` (singleton guard module) and
`shared`.

### Routing (`app-routing.module.ts`)
- `''` → redirect to `login`; auth routes loaded from `AuthenticationModule`.
- `:year` → guarded by `AuthGuardService` + `YearGuard`, children: `plans`, `budgets`
  (default `plans`).
- `**` → `PageNotFoundComponent`.

The **year is a URL path segment** (4-digit), not store state (moved to URL in commit
`8b6b227`). `YearGuard` validates it and redirects to the current year if missing/invalid.
`CoreService` is the single source of truth: it derives `year`/`year$` from the router URL.

### Shared finance feature (`src/app/finance/`)
`plans` and `budgets` are structurally identical (a yearly income/expense sheet), so they
share one implementation in `src/app/finance/` (`FinanceFeatureModule`). The feature is
named `finance` deliberately — the umbrella domain — to avoid confusion with the `budgets`
route. The two differ only by a config token `FINANCE_FEATURE_CONFIG`
({ `collection`: `plans`|`budgets`, `i18nPrefix`: `PLAN`|`BUDGET` }). `src/app/plans` and
`src/app/budgets` are now **thin modules**: each imports `FinanceFeatureModule`, provides
its config, and defines routing to the shared containers.

> Note: `collection` values stay `plans`/`budgets` — they are the Firebase path segments
> and route segments, independent of the `finance` feature name.

The shared feature splits into:
- `models/` — interfaces + `finance.enum.ts`, re-exported via `index.ts` barrel.
- `services/` — `finance-http.service` (Firebase I/O), `finance.service` (domain logic),
  `finance-facade.service` (thin API for components), `finance-breadcrumbs.service`,
  `finance-form.service`, and `*-former.utils` (pure data shaping).
- `components/` — presentational. `containers/` — routed smart components. `finance.component` — shell.
- `shared/finance.config.ts` — months, labels, nav links, defaults (Polish strings).

DI rules that make the sharing work:
- `FinanceHttpService` is **providedIn root** (stateless); the `collection` is passed as a
  method argument, so the global app-header (year selector) can use it too.
- The **stateful** services (`FinanceService`, `FinanceFacadeService`, `FinanceBreadcrumbsService`,
  `FinanceFormService`) are provided in `FinanceFeatureModule`, **not** root — each lazy host
  module (plans/budgets) gets its own isolated instance + state. They read the `collection`
  from `FINANCE_FEATURE_CONFIG` and pass it to the http service.
- The shell and summary-data components read `i18nPrefix` from the same token to pick the
  `PLAN.*` vs `BUDGET.*` translation namespace (namespaces are identical except `Title`).

Firebase paths: `/workspaces/$uid/{collection}/...`. Write flows react to write completion
(no `setTimeout` propagation hacks); failures reset the loader and show an error snackbar.

### State
- `authentication` has a full NgRx feature store (actions/effects/reducers/selectors/
  facade). `AppComponent` hydrates the NgRx user from Firebase `authState` on load.
- `shared/store` holds router store + a `RouterEffects` (GO/BACK/FORWARD) and a
  `CustomSerializer`.
- Plans/budgets domain state is held in plain injectable services (not NgRx).

### Data model (Realtime DB)
```
/workspaces/$uid/
  user                      { email, uid }
  plans/<year>/...          nested entries; <year> node has isActive flag
  budgets/<year>/...        same shape
```
Entries are hierarchical: each entry `{ label, order, total, isInTotal, notes?, entries?{} }`,
keyed by month (`jan`..`dec`). Parent totals are re-aggregated from children on write.

## Conventions & gotchas

- Component selector prefix `hb`; styles are SCSS.
- Path aliases (`tsconfig.json`): `@home-budget/*`, `@shared/*`, `@authentication/*`,
  `@finance/*` (the shared feature). `@home-budget/*` maps to `src/app/*`, so
  `@home-budget/finance/*` also resolves the feature.
- New plan/budget column keys are `${entry}NN`, derived from the **highest existing
  suffix** (not the count) so keys are not reused after a middle column is deleted
  (`nextEntryIndex`).
- Write paths capture the year as their first segment when entering a details view;
  `withCurrentYear()` rewrites a stale year when the user switches years while on details.
- **Upgrade ceiling**: `@angular/fire` (max stable ~20.1) blocks Angular 21/22.
- Tests: Jasmine + Karma, ~22 spec files. `karma.conf.js` is configured for `Chrome` —
  override `CHROME_BIN` with Edge locally.

## Memory

Longer-lived cross-session notes live in Claude Code memory at
`~/.claude/projects/-Users-patryk-Development-priv-home-budget/memory/` (indexed by
`MEMORY.md`). Keep this CLAUDE.md as the in-repo source of truth for architecture.
