import { Component, } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthenticationFacadeService } from '@authentication/store';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
})
export class AppHeaderComponent {
  user$ = this.authService.user$;

  constructor(
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
