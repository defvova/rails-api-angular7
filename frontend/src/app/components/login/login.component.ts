import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

import { AuthenticationService } from '../../service/authentication.service';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: any;
  hide = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthenticationService,
    private snackBar: MatSnackBar,
    private ngZone: NgZone,
    private api: ApiService
  ) {
    if (this.auth.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  private signInViaProvider(): void {
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

  private submit(): void {
    if (this.form.valid) {
      this.auth.login(this.f.email.value, this.f.password.value).pipe(first())
        .subscribe(resp => {
          if (resp.error) {
            this.snackBar.open(resp.error, null, { duration: 5000 });
          } else {
            this.router.navigate(['/']);
          }
        });
    }
  }
}
