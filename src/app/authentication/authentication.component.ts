import { Component, OnInit } from '@angular/core';
import { AuthenticationFacadeService } from './store';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {

  constructor(
  ) { }

  ngOnInit(): void {
  }

}
