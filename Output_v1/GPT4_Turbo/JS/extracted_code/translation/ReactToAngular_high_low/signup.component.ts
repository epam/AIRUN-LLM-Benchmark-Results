import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as AuthActions from '../actions/auth.actions';
import * as fromAuth from '../reducers';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  submitting$: Observable<boolean>;

  constructor(private fb: FormBuilder, private apiService: ApiService, private store: Store<fromAuth.State>) {
    this.createForm();
    this.submitting$ = this.store.select(fromAuth.getSubmitting);
  }

  createForm() {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    }, { validators: [this.asyncValidator.bind(this)] });
  }

  asyncValidator(control: FormGroup) {
    const name = control.get('name').value;
    const email = control.get('email').value;

    return Promise.all([
      this.apiService.isName(name),
      this.apiService.isEmail(email)
    ]).then(([nameResult, emailResult]) => {
      const errors = {};
      if (nameResult.data) {
        errors['name'] = 'This name is already in use';
      }
      if (emailResult.data) {
        errors['email'] = 'This email is already in use';
      }
      return Object.keys(errors).length ? errors : null;
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const { name, email, password } = this.signupForm.value;
      this.store.dispatch(AuthActions.signup({ name, email, password }));
    }
  }
}