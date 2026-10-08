import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationFacadeService } from '@home-budget/authentication/store';
import { CoreService } from '../../../core/core.service';
import { SharedUtilsService } from '@shared/services/shared-utils.service';
import { PlansHttpService } from '@home-budget/plans/services/plans-http.service';
import { filter, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  standalone: false
})
export class AppHeaderComponent {
  private readonly authService = inject(AuthenticationFacadeService);
  private readonly coreService = inject(CoreService);
  private readonly plansHttpService = inject(PlansHttpService);
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
    switchMap((user) => this.plansHttpService.readYears(user.uid)),
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
