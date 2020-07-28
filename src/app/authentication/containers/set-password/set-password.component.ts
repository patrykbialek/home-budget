import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';

import { CommonWithAnimationComponent } from '@shared/components';
import * as fromModels from '../../models';
import * as fromServices from '../../store/services';

@Component({
  selector: 'hb-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss']
})
export class SetPasswordComponent extends CommonWithAnimationComponent implements OnInit {

  code: string;
  setForm: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authenticationService: fromServices.AuthenticationFacadeService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
    this.createForm();
    this.code = this.activatedRoute.snapshot.queryParams['oobCode'];
    if (!this.code) {
      this.router.navigate(['../login']);
    }
  }

  createForm() {
    this.setForm = this.formBuilder.group({
      password: [null, [Validators.required]],
    });
  }

  setPassword(event: FormGroup) {
    const payload: fromModels.UserPayload = {
      key: null,
      value: event.value
    };
    payload.value.code = this.code;

    this.authenticationService.setPassword(payload)
    this.authenticationService.isSuccess$
      .pipe(
        tap(response => {
          if (response) {
            this.router.navigate(['../login']);
          }
        }),
      ).subscribe();
  }
}
