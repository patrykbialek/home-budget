import { Component, HostListener, OnInit, inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { filter, mergeMap, take, tap } from 'rxjs/operators';

import * as fromModels from '@home-budget/authentication/models';
import { AuthenticationFacadeService } from '@home-budget/authentication/store';
import { WindowSize } from '@home-budget/shared/models';
import { SharedUtilsService } from '@home-budget/shared/services/shared-utils.service';

const mobileBreakPoint = 840;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
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
    const setUser = (payload: fromModels.User) => this.authenticationService.setUser(payload);
    const user$ = this.authenticationService.user$;
    const authState$ = authState(this.fireAuth)
      .pipe(
        take(1),
        filter(response => Boolean(response)),
        tap(response => setUser({
          displayName: (response as fromModels.User).displayName,
          email: (response as fromModels.User).email,
          uid: (response as fromModels.User).uid
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
