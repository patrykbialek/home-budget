import { Component } from '@angular/core';
import { CommonWithAnimationComponent } from '@home-budget/shared/components/common-with-animation.component';

@Component({
  selector: 'hb-page-not-found',
  template: `
    <app-main-component>

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
            <a role="button" mat-raised-button color="primary" [routerLink]="['../dashboard']">
              {{ 'PAGE_NOT_FOUND.Actions.GoToMainPage' | translate }}
            </a>
          </div>
        </div>
      </div>
    </section>

    </app-main-component>
  `,
})
export class PageNotFoundComponent extends CommonWithAnimationComponent {
  constructor() {
    super();
  }
}
