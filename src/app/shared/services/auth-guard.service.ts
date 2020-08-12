import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivate,
  Router, RouterStateSnapshot
} from '@angular/router';
import { AuthenticationHttpService } from '@home-budget/authentication/services/authentication-http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(
    private authService: AuthenticationHttpService,
    private router: Router,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.authState$.pipe(
      map((authState) => {
        if (authState !== null) {
          return true;
        }

        this.router.navigate(['/login']);
        return false;
      })
    );
  }
}
