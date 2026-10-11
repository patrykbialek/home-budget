import { InjectionToken } from '@angular/core';

/**
 * Configuration that distinguishes the two instances of the shared budget feature.
 * `plans` and `budgets` are structurally identical; they differ only by the Firebase
 * collection / route segment and the i18n namespace used for labels.
 */
export interface BudgetFeatureConfig {
  /** Firebase path + route segment: `plans` | `budgets`. */
  collection: string;
  /** i18n namespace prefix: `PLAN` | `BUDGET`. */
  i18nPrefix: string;
}

export const BUDGET_FEATURE_CONFIG = new InjectionToken<BudgetFeatureConfig>(
  'BUDGET_FEATURE_CONFIG',
);
