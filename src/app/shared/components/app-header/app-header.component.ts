import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationFacadeService } from '@authentication/store';
import { TranslateService } from '@ngx-translate/core';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
})
export class AppHeaderComponent {

  currentLang = 'EN';

  user$ = this.authService.user$;

  constructor(
    private authService: AuthenticationFacadeService,
    private router: Router,
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
    this.authService.logoutUser();

    this.authService.isSuccess$
      .pipe(
        tap(response => {
          if (response) {
            this.router.navigate(['./login']);
          }
        }),
      ).subscribe();
  }
}
