import { Type } from '@angular/core';
import { AuthenticationEffects } from './authentication.effects';

export const effects: Type<unknown>[] = [ AuthenticationEffects, ];

export * from './authentication.effects';
