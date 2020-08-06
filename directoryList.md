|-- src
    |-- .DS_Store
    |-- app-routing.module.ts
    |-- app.component.html
    |-- app.component.scss
    |-- app.component.spec.ts
    |-- app.component.ts
    |-- app.module.ts
    |-- authentication
    |   |-- authentication-routing.module.ts
    |   |-- authentication.component.html
    |   |-- authentication.component.scss
    |   |-- authentication.component.ts
    |   |-- authentication.module.ts
    |   |-- components
    |   |   |-- authentication-form.component.spec.ts
    |   |   |-- authentication-form.component.ts
    |   |   |-- index.ts
    |   |   |-- login-user
    |   |   |   |-- login-form.component.html
    |   |   |   |-- login-form.component.scss
    |   |   |   |-- login-form.component.spec.ts
    |   |   |   |-- login-form.component.ts
    |   |   |-- register-user
    |   |   |   |-- register-form.component.html
    |   |   |   |-- register-form.component.scss
    |   |   |   |-- register-form.component.spec.ts
    |   |   |   |-- register-form.component.ts
    |   |   |-- reset-password
    |   |   |   |-- reset-form.component.html
    |   |   |   |-- reset-form.component.scss
    |   |   |   |-- reset-form.component.spec.ts
    |   |   |   |-- reset-form.component.ts
    |   |   |-- set-password
    |   |       |-- set-form.component.html
    |   |       |-- set-form.component.scss
    |   |       |-- set-form.component.spec.ts
    |   |       |-- set-form.component.ts
    |   |-- containers
    |   |   |-- index.ts
    |   |   |-- login-user
    |   |   |   |-- login-user.component.html
    |   |   |   |-- login-user.component.scss
    |   |   |   |-- login-user.component.spec.ts
    |   |   |   |-- login-user.component.ts
    |   |   |-- register-user
    |   |   |   |-- register-user.component.html
    |   |   |   |-- register-user.component.scss
    |   |   |   |-- register-user.component.spec.ts
    |   |   |   |-- register-user.component.ts
    |   |   |-- reset-password
    |   |   |   |-- reset-password.component.html
    |   |   |   |-- reset-password.component.scss
    |   |   |   |-- reset-password.component.spec.ts
    |   |   |   |-- reset-password.component.ts
    |   |   |-- set-password
    |   |       |-- set-password.component.html
    |   |       |-- set-password.component.scss
    |   |       |-- set-password.component.spec.ts
    |   |       |-- set-password.component.ts
    |   |-- models
    |   |   |-- api-errors.data.spec.ts
    |   |   |-- api-errors.data.ts
    |   |   |-- index.ts
    |   |   |-- user-payload.model.ts
    |   |   |-- user.model.ts
    |   |-- services
    |   |   |-- authentication-http.service.spec.ts
    |   |   |-- authentication-http.service.ts
    |   |   |-- authentication-utils.service.ts
    |   |   |-- index.ts
    |   |-- store
    |       |-- authentication-store.module.ts
    |       |-- index.ts
    |       |-- actions
    |       |   |-- authentication.action.spec.ts
    |       |   |-- authentication.actions.ts
    |       |   |-- index.ts
    |       |-- effects
    |       |   |-- authentication.effects.spec.ts
    |       |   |-- authentication.effects.ts
    |       |   |-- index.ts
    |       |-- reducers
    |       |   |-- authentication.reducer.spec.ts
    |       |   |-- authentication.reducer.ts
    |       |   |-- index.ts
    |       |-- selectors
    |       |   |-- authentication.selector.spec.ts
    |       |   |-- authentication.selector.ts
    |       |   |-- index.ts
    |       |-- services
    |           |-- authentication-facade.service.ts
    |           |-- authentication-facade.spec.ts
    |           |-- index.ts
    |-- dashboard
    |   |-- dashboard-routing.module.ts
    |   |-- dashboard.component.html
    |   |-- dashboard.component.scss
    |   |-- dashboard.component.spec.ts
    |   |-- dashboard.component.ts
    |   |-- dashboard.module.ts
    |-- settings
    |   |-- settings-routing.module.ts
    |   |-- settings.component.html
    |   |-- settings.component.scss
    |   |-- settings.component.spec.ts
    |   |-- settings.component.ts
    |   |-- settings.module.ts
    |-- shared
    |   |-- shared.module.ts
    |   |-- components
    |   |   |-- common-with-animation.component.ts
    |   |   |-- index.ts
    |   |   |-- page-not-found.component.ts
    |   |   |-- app-header
    |   |   |   |-- app-header.component.html
    |   |   |   |-- app-header.component.scss
    |   |   |   |-- app-header.component.spec.ts
    |   |   |   |-- app-header.component.ts
    |   |   |-- app-spinner
    |   |   |   |-- app-spinner.component.scss
    |   |   |   |-- app-spinner.component.ts
    |   |   |-- budget-category-icon
    |   |       |-- budget-category-icon.component.html
    |   |       |-- budget-category-icon.component.ts
    |   |-- models
    |   |   |-- index.ts
    |   |   |-- window-size.enum.ts
    |   |-- modules
    |   |   |-- angular-material.module.ts
    |   |-- services
    |   |   |-- auth-guard.service.ts
    |   |   |-- shared-utils.service.ts
    |   |-- store
    |       |-- index.ts
    |       |-- actions
    |       |   |-- index.ts
    |       |   |-- router.actions.spec.ts
    |       |   |-- router.actions.ts
    |       |-- effects
    |       |   |-- index.ts
    |       |   |-- router.effect.ts
    |       |-- reducers
    |           |-- index.ts
    |-- transactions
        |-- transactions-routing.module.ts
        |-- transactions.component.html
        |-- transactions.component.scss
        |-- transactions.component.spec.ts
        |-- transactions.component.ts
        |-- transactions.module.ts
        |-- components
        |   |-- index.ts
        |   |-- transaction-detail
        |   |   |-- form.component.html
        |   |   |-- form.component.scss
        |   |   |-- form.component.spec.ts
        |   |   |-- form.component.ts
        |   |-- transaction-list
        |       |-- data.component.html
        |       |-- data.component.scss
        |       |-- data.component.spec.ts
        |       |-- data.component.ts
        |       |-- filters.component.html
        |       |-- filters.component.scss
        |       |-- filters.component.spec.ts
        |       |-- filters.component.ts
        |-- containers
        |   |-- index.ts
        |   |-- transaction-detail
        |   |   |-- transaction-detail.component.html
        |   |   |-- transaction-detail.component.scss
        |   |   |-- transaction-detail.component.spec.ts
        |   |   |-- transaction-detail.component.ts
        |   |-- transaction-list
        |       |-- transaction-list.component.html
        |       |-- transaction-list.component.scss
        |       |-- transaction-list.component.spec.ts
        |       |-- transaction-list.component.ts
        |-- models
        |   |-- account-type.enum.ts
        |   |-- account.model.ts
        |   |-- budget-categories.data.ts
        |   |-- budget-category.enum.ts
        |   |-- index.ts
        |   |-- query-periods.data.ts
        |   |-- query.model.ts
        |   |-- transaction-payload.model.ts
        |   |-- transaction-type.enum.ts
        |   |-- transaction.model.ts
        |-- services
        |   |-- index.ts
        |   |-- transactions-http.service.spec.ts
        |   |-- transactions-http.service.ts
        |-- store
            |-- index.ts
            |-- transactions-store.module.ts
            |-- actions
            |   |-- index.ts
            |   |-- transactions.action.spec.ts
            |   |-- transactions.actions.ts
            |-- effects
            |   |-- index.ts
            |   |-- transactions.effect.spec.ts
            |   |-- transactions.effect.ts
            |-- reducers
            |   |-- index.ts
            |   |-- transactions.reducer.spec.ts
            |   |-- transactions.reducer.ts
            |-- selectors
            |   |-- index.ts
            |   |-- transactions.selector.spec.ts
            |   |-- transactions.selector.ts
            |-- services
                |-- index.ts
                |-- transactions-facade.service.ts
                |-- transactions-facade.spec.ts
