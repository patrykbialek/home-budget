import { Auth, authState } from '@angular/fire/auth';
import { Component, HostListener, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { filter, mergeMap, take, tap } from 'rxjs/operators';

import { AppHeaderComponent } from '@home-budget/shared/components';
import { AuthenticationFacadeService } from '@home-budget/authentication/store';
import { SharedUtilsService } from '@home-budget/shared/services/shared-utils.service';
import { User } from '@home-budget/authentication/models';
import { WindowSize } from '@home-budget/shared/models';

const mobileBreakPoint = 840;

@Component({
  selector: 'hb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [AppHeaderComponent, RouterOutlet]
})
export class AppComponent implements OnInit {
  private authenticationService = inject(AuthenticationFacadeService);
  private fireAuth = inject(Auth);
  private sharedUtilsService = inject(SharedUtilsService);

  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent) {
    this.setWindowResizeListener((event.target as Window).innerWidth);
  }

  ngOnInit() {
    this.setUserIfAuthenticated();
    this.setWindowResizeListener(window.innerWidth);
  }

  private setUserIfAuthenticated() {
    const setUser = (payload: User) => this.authenticationService.setUser(payload);
    const user$ = this.authenticationService.user$;
    const authState$ = authState(this.fireAuth)
      .pipe(
        take(1),
        filter(response => Boolean(response)),
        tap(response => setUser({
          displayName: (response as User).displayName,
          email: (response as User).email,
          uid: (response as User).uid
        })),
      );

    user$.pipe(
      take(1),
      filter(response => !response),
      mergeMap(() => authState$),
    ).subscribe();
  }

  private setWindowResizeListener(innerWidth: number) {
    const windowSize = innerWidth < mobileBreakPoint
      ? WindowSize.Mobile
      : WindowSize.Desktop;
    this.sharedUtilsService.setIsMobileSize(windowSize);
  }
}
