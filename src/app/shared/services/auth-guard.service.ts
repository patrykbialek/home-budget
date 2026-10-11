import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable, inject } from '@angular/core';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { AuthenticationHttpService } from '@home-budget/authentication/services/authentication-http.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService  {
  private authService = inject(AuthenticationHttpService);
  private router = inject(Router);

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
