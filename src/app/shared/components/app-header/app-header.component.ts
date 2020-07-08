import { Component, } from '@angular/core';
import { AuthenticationHttpService } from '@authentication/services';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthenticationFacadeService } from '@authentication/store';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
})
export class AppHeaderComponent {
  user$ = this.authenticationHttpService.user$;
  // user_$ = this.authService.user$.pipe(tap(console.log)).subscribe();

  constructor(
    private authenticationHttpService: AuthenticationHttpService,
    private authService: AuthenticationFacadeService,
    private router: Router,
  ) { }

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
