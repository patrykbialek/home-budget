import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationUtilsService {

  private validators = {
    email: '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'
  };

  get emailPattern() {
    return this.validators.email;
  }

}
