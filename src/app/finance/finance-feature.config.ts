import { InjectionToken } from '@angular/core';

export interface FinanceFeatureConfig {
  collection: string;
  i18nPrefix: string;
}

export const FINANCE_FEATURE_CONFIG = new InjectionToken<FinanceFeatureConfig>(
  'FINANCE_FEATURE_CONFIG',
);
