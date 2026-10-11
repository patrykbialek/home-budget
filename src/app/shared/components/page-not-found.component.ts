import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

import { TranslatePipe } from '@ngx-translate/core';

import { CommonWithAnimationComponent } from '@home-budget/shared/components/common-with-animation.component';

@Component({
  selector: 'hb-page-not-found',
  template: `
    <hb-main-component>

    <div class="c-section-header">
      <div class="o-wrapper">
        <header class="c-section-header__title">
          <h4 class="u-margin-right-small">{{ 'PAGE_NOT_FOUND.Title' | translate }}</h4>
        </header>
      </div>
    </div>

    <section class="c-section-content" class="u-padding-bottom-huge" style="padding-top: 96px;">
      <div class="o-grid">
        <div class="o-grid__cell u-1/1">
          <div class="o-block o-block--left">
            <a role="button" mat-raised-button color="primary" [routerLink]="['/', year, 'plans']">
              {{ 'PAGE_NOT_FOUND.Actions.GoToMainPage' | translate }}
            </a>
          </div>
        </div>
      </div>
    </section>

    </hb-main-component>
  `,
  imports: [CommonWithAnimationComponent, MatButton, RouterLink, TranslatePipe]
})
export class PageNotFoundComponent extends CommonWithAnimationComponent {
  get year(): string {
    return new Date().getFullYear().toString();
  }
}
