import { TestBed } from '@angular/core/testing';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { environment } from 'src/environments/environment';

import { AuthenticationHttpService } from './authentication-http.service';

describe('AuthenticationHttpService', () => {
  let service: AuthenticationHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
        provideDatabase(() => getDatabase()),
      ],
    });
    service = TestBed.inject(AuthenticationHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
