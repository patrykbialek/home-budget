import { Component, HostListener, OnInit } from '@angular/core';
import * as fromModels from '@authentication/models';
import { WindowSize } from '@home-budget/shared/models';
import { SharedUtilsService } from '@home-budget/shared/services/shared-utils.service';
import { TranslateService } from '@ngx-translate/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { filter, mergeMap, take, tap } from 'rxjs/operators';
import { AuthenticationFacadeService } from './authentication/store';

const mobileBreakPoint = 840;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    translate: TranslateService,
    private authenticationService: AuthenticationFacadeService,
    private fireAuth: AngularFireAuth,
    private sharedUtilsService: SharedUtilsService,
  ) {
    translate.setDefaultLang('pl');
    translate.use('pl');
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setWindowResizeListener(event.target.innerWidth);
  }

  ngOnInit() {
    this.setUserIfAuthenticated();
    this.setWindowResizeListener(window.innerWidth);
  }

  private setUserIfAuthenticated() {
    const setUser = (payload: fromModels.User) => this.authenticationService.setUser(payload);
    const user$ = this.authenticationService.user$;
    const authState$ = this.fireAuth
      .authState
      .pipe(
        take(1),
        filter(response => Boolean(response)),
        tap(response => setUser({
          displayName: response.displayName,
          email: response.email,
          uid: response.uid
        })),
      );

    user$.pipe(
      take(1),
      filter(response => Boolean(!response)),
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
