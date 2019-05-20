import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { MatSnackBar } from '@angular/material';

import { User } from '../../interface/user';
import { AuthenticationService } from '../../service/authentication.service';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  currentUser: User;
  currentUserSubscription: Subscription;
  formProfile: any;
  formPassword: any;
  serverError = '';
  hidePassword = true;
  hideNewPassword = true;
  hideConfirmation = true;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private auth: AuthenticationService,
    private snackBar: MatSnackBar
  ) {
    this.currentUserSubscription = this.auth.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    const { email, first_name, last_name } = this.currentUser.attributes;

    this.formProfile = this.fb.group({
      email: [email, [Validators.required, Validators.email]],
      first_name: [first_name],
      last_name: [last_name]
    });

    this.initPassForm();
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

  private initPassForm(): any {
    this.formPassword = this.fb.group({
      current_password:      ['', [Validators.required, Validators.minLength(6)]],
      password:              ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  private getDirtyValues(form: any): object {
    const dirtyValues = {};

    Object.keys(form.controls)
      .forEach(key => {
        const currentControl = form.controls[key];

        if (currentControl.dirty) {
          if (currentControl.controls) {
            dirtyValues[key] = this.getDirtyValues(currentControl);
          } else {
            dirtyValues[key] = currentControl.value;
          }
        }
      });

    return dirtyValues;
  }

  private hasError(controlName: string, errorName: string, formName: string): boolean {
    return this[formName].controls[controlName].hasError(errorName);
  }

  private submitProfile() {
    const callback = (data) => {
      this.auth.setCurrentUser({ ...this.currentUser, attributes: { ...this.formProfile.value, ...data } });
    };
    this.submit('formProfile', 'users', callback);
  }

  private submitPassword() {
    const callback = () => {
      this.formPassword.reset();
      this.snackBar.open('Password was successfully updated! Skip errors, sorry for that!', null, { duration: 5000 });
    };
    this.submit('formPassword', 'passwords', callback);
  }

  private submit(formName: string, url: string, callback: any) {
    const data = this.getDirtyValues(this[formName]);
    if (this[formName].valid && !_.isEmpty(data)) {

      const id = this.currentUser.id;
      this.api.update(`/${url}/${id}`, { user: data }).subscribe((resp) => {
        if (resp.errors) {
          _.map(resp.errors, (val, key) => {
            this.serverError = val[0];
            return this[formName].controls[key].setErrors({ serverError: true });
          });
        } else {
          callback(data);
        }
      });
    }
  }
}
