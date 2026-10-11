import { InjectionToken } from '@angular/core';

/**
 * Configuration that distinguishes the two instances of the shared finance feature.
 * `plans` and `finances` are structurally identical; they differ only by the Firebase
 * collection / route segment and the i18n namespace used for labels.
 */
export interface FinanceFeatureConfig {
  /** Firebase path + route segment: `plans` | `finances`. */
  collection: string;
  /** i18n namespace prefix: `PLAN` | `BUDGET`. */
  i18nPrefix: string;
}

export const FINANCE_FEATURE_CONFIG = new InjectionToken<FinanceFeatureConfig>(
  'FINANCE_FEATURE_CONFIG',
);
