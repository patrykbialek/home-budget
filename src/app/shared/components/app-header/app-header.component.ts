import { Component, inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { NgStyle, AsyncPipe } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { filter, switchMap } from 'rxjs/operators';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';

import { AuthenticationFacadeService } from '@home-budget/authentication/store';
import { CoreService } from '../../../core/core.service';
import { FinanceHttpService } from '@home-budget/finance/services/finance-http.service';
import { SharedUtilsService } from '@shared/services/shared-utils.service';

@Component({
  selector: 'hb-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  imports: [MatToolbar, MatToolbarRow, RouterLink, MatButton, NgStyle, RouterLinkActive, MatIcon, MatIconButton, MatMenuTrigger, MatMenu, MatMenuItem, MatDivider, AsyncPipe, TranslatePipe]
})
export class AppHeaderComponent {
  private readonly authService = inject(AuthenticationFacadeService);
  private readonly coreService = inject(CoreService);
  private readonly financeHttpService = inject(FinanceHttpService);
  private readonly router = inject(Router);
  private readonly sharedUtilsService = inject(SharedUtilsService);
  private readonly translateService = inject(TranslateService);

  currentLang = 'EN';
  planYear: string | undefined;

  windowSize$ = this.sharedUtilsService.windowSize$;
  user$ = this.authService.user$;
  year$ = this.coreService.year$;
  years$ = this.user$.pipe(
    filter(Boolean),
    switchMap((user) => this.financeHttpService.readYears(user.uid)),
  );

  onChangeLanguage() {
    this.translateService.use(this.currentLang.toLocaleLowerCase());
    this.currentLang =
      this.currentLang === 'PL'
        ? 'EN'
        : 'PL';
  }

  get year(): string {
    return this.coreService.year;
  }

  onLogout() {
    this.authService.logoutUserFromContainer();
  }

  setYear(year: string) {
    const rest = this.router.url.split('?')[0].split('/').filter(Boolean).slice(1);
    this.router.navigate(['/', year, ...rest]);
  }
}
