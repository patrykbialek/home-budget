import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationFacadeService } from '@home-budget/authentication/store';
import { CoreService } from '../../../core/core.service';
import { TranslateService } from '@ngx-translate/core';
import { SharedUtilsService } from '@shared/services/shared-utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
})
export class AppHeaderComponent {

  currentLang = 'EN';
  planYear: string;

  windowSize$ = this.sharedUtilsService.windowSize$;
  user$ = this.authService.user$;
  year$ = this.coreService.year$;

  constructor(
    private readonly authService: AuthenticationFacadeService,
    private readonly coreService: CoreService,
    private readonly router: Router,
    private readonly sharedUtilsService: SharedUtilsService,
    private readonly translateService: TranslateService,
  ) {   }

  onChangeLanguage() {
    this.translateService.use(this.currentLang.toLocaleLowerCase());
    this.currentLang =
      this.currentLang === 'PL'
        ? 'EN'
        : 'PL';
  }

  onLogout() {
    localStorage.removeItem('uid');
    this.router.navigate(['./login']);
  }

  setYear(year: string) {
    this.coreService.setYear(year);
  }
}
