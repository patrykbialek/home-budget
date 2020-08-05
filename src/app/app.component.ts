import { Component, HostListener, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { WindowSize } from '@shared/models';
import { AngularFireAuth } from 'angularfire2/auth';
import { filter, take, tap } from 'rxjs/operators';
import { AuthenticationFacadeService } from './authentication/store';
import { SharedUtilsService } from './shared/services/shared-utils.service';

const mobileBreakPoint = 840;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    translate: TranslateService,
    private authenticationFacadeService: AuthenticationFacadeService,
    private fireAuth: AngularFireAuth,
    private sharedUtilsService: SharedUtilsService,
  ) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('pl');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('pl');
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    const windowSize = event.target.innerWidth < mobileBreakPoint
      ? WindowSize.Mobile
      : WindowSize.Desktop;
    this.sharedUtilsService.setIsMobileSize(windowSize);
  }

  ngOnInit() {
    this.fireAuth
      .authState
      .pipe(
        filter(response => Boolean(response)),
        tap(response => this.authenticationFacadeService.getUser(response.uid)),
        take(1),
      ).subscribe();

    const windowSize = window.innerWidth < mobileBreakPoint
      ? WindowSize.Mobile
      : WindowSize.Desktop;
    this.sharedUtilsService.setIsMobileSize(windowSize);
  }
}
