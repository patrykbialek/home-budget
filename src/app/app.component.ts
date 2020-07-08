import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthenticationFacadeService } from './authentication/store';
import { tap, filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'home-budget';

  constructor(
    translate: TranslateService,
    private fireAuth: AngularFireAuth,
    private authenticationFacadeService: AuthenticationFacadeService,
  ) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('pl');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('pl');

    this.fireAuth
      .authState
      .pipe(
        filter(response => Boolean(response)),
        // tap(response => console.log('uid', response.uid)),
        tap(response => this.authenticationFacadeService.getUser(response.uid)),
        take(1),
      ).subscribe();
  }
}
