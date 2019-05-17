import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import * as _ from 'lodash';

import { AuthenticationService } from '../service/authentication.service';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  form: any;
  hide = true;
  hideConfirmation = true;
  serverError = '';

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private auth: AuthenticationService,
    private ngZone: NgZone,
    private router: Router
  ) {
    if (this.auth.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.form = this.fb.group({
      email:                 ['', [Validators.required, Validators.email]],
      password:              ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  private signUpViaProvider(): void {
    this.auth.authGithub((obs) => {
      obs.pipe(first()).subscribe(resp => {
        if (resp.data) {
          this.ngZone.run(() => this.router.navigate(['/'])).then();
        }
      });
    });
  }

  private get f() { return this.form.controls; }

  private hasError(controlName: string, errorName: string): boolean {
    return this.f[controlName].hasError(errorName);
  }

  private submit() {
    if (this.form.valid) {
      this.api.post('/users', { user: this.form.value }).subscribe((resp) => {
        if (resp.errors) {
          _.map(resp.errors, (val, key) => {
            this.serverError = val[0];
            return this.f[key].setErrors({ serverError: true });
          });
        } else {
          this.router.navigate(['login']);
        }
      });
    }
  }
}
