# Home-budget

A single-page web app for planning and tracking a household budget by year.
Users sign in (Firebase email/password), then manage two parallel areas: **Plans**
(the intended budget) and **Budgets** (actual execution), broken down by month and
hierarchical categories. UI is in Polish.

Demo: [https://plan-and-budget.web.app/](https://plan-and-budget.web.app/)

## List of content
- [Application description](#application-description)
- [Project structure](#project-structure)
- [Technology stack](#technology-stack)
- [Serve, build and deploy](#serve-build-and-deploy)
- [Unit tests](#unit-tests)

## Application description

Main features:
- **Authentication** — register, login, reset password, set password
- **Plans** — plan the budget per year: hierarchical income/expense categories per
  month, editable entries, add/edit/delete columns, per-month and project totals, chart
- **Budgets** — the execution counterpart of Plans, same structure and interactions

The selected year is part of the URL (`/:year/plans`, `/:year/budgets`) and is the
single source of truth for which year's data is shown.

[Go top](#home-budget)

## Project structure

By-feature architecture. Each feature module is lazy-loaded and split into the same
layers. High-level layout:

```
src/app
├── app.module.ts, app-routing.module.ts        app shell, root routing + guards
├── core/                                        singleton CoreService (derives year from URL)
├── shared/                                       shared components, Material module, router NgRx store, guards
├── authentication/                               register / login / reset / set password (+ full NgRx store)
├── finance/                                       shared "yearly income/expense sheet" feature (FinanceFeatureModule)
│   ├── models/        interfaces + enums (barrel index.ts)
│   ├── services/      http (Firebase I/O), domain service, facade, breadcrumbs, form, former-utils
│   ├── components/    presentational
│   ├── containers/    routed smart components (summary / details / breadcrumbs)
│   ├── shared/        config (months, labels, nav links, defaults)
│   └── finance-feature.config.ts  FINANCE_FEATURE_CONFIG token (collection + i18n prefix)
├── plans/                                         thin module: configures the feature as `plans`
└── budgets/                                       thin module: configures the feature as `budgets`
```

> `plans` and `budgets` are structurally identical, so they share one implementation in
> `finance/` (named for the umbrella domain, to avoid confusion with the `budgets` route);
> the thin `plans`/`budgets` modules only provide a config token selecting the Firebase
> collection (`plans` vs `budgets`) and i18n namespace. See `CLAUDE.md` for the full
> architecture, routing, and data-model notes.

[Go top](#home-budget)

## Technology stack

- **Backend & hosting**: Firebase (Realtime Database + Auth + Hosting)
- **Frontend**: Angular 20 (NgModule-based)
  - TypeScript
  - State management: `@ngrx/store` (+ effects, router-store)
  - Firebase integration: `@angular/fire`
  - i18n: `@ngx-translate` (default `pl`)
  - Charts: `ng2-charts` / `chart.js`
  - Layout: Angular Material + custom SCSS with `inuit-flexgrid` and `inuitcss`

[Go top](#home-budget)

## Serve, build and deploy

Use Node 22 (`nvm use`, see `.nvmrc`).

### Development server
`npm start` (`ng serve`) runs a dev server on `http://localhost:4200/` against the
**dev** Firebase project (`plan-budget-test`). The app reloads on source changes.

### Build
`npm run build` (`ng build`) builds into `dist/`. It defaults to the **production**
configuration, which targets the prod Firebase project (`plan-and-budget`).

### Deploy
Flow: **feature branch → merge to `develop` → build → deploy**. Never deploy directly
from a feature branch. Then `firebase deploy` (you must be authenticated;
`.firebaserc` default project is `plan-and-budget`).

[Go top](#home-budget)

## Unit tests

Run `ng test` to execute unit tests via [Karma](https://karma-runner.github.io) +
Jasmine. (`karma.conf.js` is configured for Chrome; if Chrome is not installed, point
`CHROME_BIN` at another Chromium-based browser such as Edge.)

[Go top](#home-budget)
