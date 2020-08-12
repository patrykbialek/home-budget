import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationFacadeService } from '@authentication/store';
import { SharedUtilsService } from '@home-budget/shared/services/shared-utils.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
})
export class AppHeaderComponent {

  currentLang = 'EN';

  windowSize$ = this.sharedUtilsService.windowSize$;
  user$ = this.authService.user$

  constructor(
    private authService: AuthenticationFacadeService,
    private router: Router,
    private sharedUtilsService: SharedUtilsService,
    private translateService: TranslateService,
  ) { }

  onChangeLanguage() {
    this.translateService.use(this.currentLang.toLocaleLowerCase());
    this.currentLang =
      this.currentLang === 'PL'
        ? 'EN'
        : 'PL';
  }

  onLogout() {
    this.router.navigate(['./login']);
  }
}
