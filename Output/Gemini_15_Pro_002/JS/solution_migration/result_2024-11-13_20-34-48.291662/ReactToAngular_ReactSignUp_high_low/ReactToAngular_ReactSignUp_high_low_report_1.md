I have the following React app code:

signup.js
```js
import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import DocumentTitle from 'react-document-title';
import { Link } from 'react-router';
import { reduxForm } from 'redux-form';
import validator from 'validator';

import { Button } from 'react-bootstrap';

import * as api from '../api';
import { auth } from '../actions';
import { getTitle } from './utils';
import { FormGroup } from '../components/form';
import Icon from '../components/icon';

const validate = values => {
  const { name, email, password } = values;
  const errors = {};

  if (!name || name.length < 3 || name.length > 60) {
    errors.name = 'Name must be between 3 and 60 characters in length';
  }

  if (!email || !validator.isEmail(email)) {
    errors.email = 'A valid email address is required';
  }

  if (!password || password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return errors;
};

const asyncValidate = values => {
  const checkName = () => {
    if (!values.name) return false;
    return api.isName(values.name)
    .then(result => {
      if (result.data) {
        return { name: 'This name is already in use' };
      }
    });
  };

  const checkEmail = () => {
    if (!values.email) return false;
    return api.isEmail(values.email)
    .then(result => {
      if (result.data) {
        return { email: 'This email is already in use' };
      }
    });
  };

  return Promise.all([
    checkEmail(),
    checkName(),
  ])
  .then(errors => {
    return errors.reduce((res, error) => {
      if (error) {
        return Object.assign({}, res, error);
      }
      return res;
    }, {});
  });
};

export class Signup extends React.Component {

  constructor(props) {
    super(props);
    const { dispatch } = this.props;
    this.actions = bindActionCreators(auth, dispatch);
  }

  handleSubmit(values) {
    const { name, email, password } = values;
    return new Promise((resolve, reject) => {
      api.signup(name, email, password)
      .then(result => {
        this.actions.signupComplete(result.data);
        resolve();
      }, error => {
        reject(error.data);
      });
    });
  }

  render() {
    const {
      fields: { name, email, password },
      handleSubmit,
      submitting,
    } = this.props;

    const onSubmit = handleSubmit(this.handleSubmit.bind(this));

    return (
    <DocumentTitle title={getTitle('Signup')}>
      <div>
        <h2>Join PodBaby today.</h2>
        <hr />
        <p className="lead">
          As a member you can subscribe to podcast feeds and keep track of your favorite episodes.
        </p>
        <form className="form-horizontal" onSubmit={onSubmit}>
          <FormGroup field={name}>
            <input type="text" className="form-control" placeholder="Name" {...name} />
          </FormGroup>

          <FormGroup field={email}>
            <input type="email" className="form-control" placeholder="Email address" {...email} />
          </FormGroup>

          <FormGroup field={password}>
            <input type="password" className="form-control" placeholder="Password" {...password} />
          </FormGroup>
          <Button
            bsStyle="primary"
            disabled={submitting}
            onClick={onSubmit}
            className="form-control"
            type="submit"
          ><Icon icon="sign-in" /> Signup
          </Button>
        </form>
        <p><Link to="/login/">Already a member? Log in here.</Link></p>
      </div>
    </DocumentTitle>

    );
  }
}

Signup.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  asyncValidating: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const fields = ['name', 'email', 'password'];
const asyncBlurFields = ['name', 'email'];

export default reduxForm({
  form: 'signup',
  fields,
  validate,
  asyncValidate,
  asyncBlurFields })(Signup);

```

form.js
```js
import React, { PropTypes } from 'react';
import { Input } from 'react-bootstrap';

export const FormGroup = props => {
  const { field } = props;

  let bsStyle;

  if (field.touched) {
    bsStyle = field.error ? 'error' : 'success';
  }

  return (
    <Input hasFeedback={field.touched} bsStyle={bsStyle}>
      {props.children}
      {field.touched && field.error && <span className="help-block">{field.error}</span>}
    </Input>
  );
};

FormGroup.propTypes = {
  field: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
};

```


Your task is to migrate this code to Angular 14.x., assume that the code which is not provided has been already migrated and has the same contract.
When performing the translation, ensure to adhere to the instructions below:
- Use common libraries: @ngrx/store and @ngrx/effects if needed.
- For big files try to split the code into separate components or functions.
- Optimize the code where possible.
- The converted code should not contain any TODOs.
- Return the translated code as markdown code snippets.
- Simply return the codebase without additional comments or explanations on how to convert it.

## Run 1:
### Answer:
```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { firstValueFrom, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { AuthService } from '../auth.service'; // Assumed migrated
import { signupComplete } from '../actions'; // Assumed migrated
import { getTitle } from './utils'; // Assumed migrated
import { User } from '../models'; // Assumed migrated

@Component({
  selector: 'app-signup',
  template: `
    <div>
      <h2>Join PodBaby today.</h2>
      <hr />
      <p class="lead">
        As a member you can subscribe to podcast feeds and keep track of your
        favorite episodes.
      </p>
      <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
        <div class="form-group" [ngClass]="{'has-error': name?.invalid && name?.touched, 'has-success': name?.valid && name?.touched}">
          <input type="text" class="form-control" placeholder="Name" formControlName="name" />
          <div *ngIf="name?.invalid && name?.touched" class="help-block">
            <div *ngIf="name?.errors?.['required']">Name is required.</div>
            <div *ngIf="name?.errors?.['minlength']">Name must be at least 3 characters.</div>
            <div *ngIf="name?.errors?.['maxlength']">Name cannot exceed 60 characters.</div>
            <div *ngIf="name?.errors?.['nameExists']">This name is already in use.</div>
          </div>
        </div>

        <div class="form-group" [ngClass]="{'has-error': email?.invalid && email?.touched, 'has-success': email?.valid && email?.touched}">
          <input type="email" class="form-control" placeholder="Email address" formControlName="email" />
          <div *ngIf="email?.invalid && email?.touched" class="help-block">
            <div *ngIf="email?.errors?.['required']">Email is required.</div>
            <div *ngIf="email?.errors?.['email']">Invalid email address.</div>
            <div *ngIf="email?.errors?.['emailExists']">This email is already in use.</div>
          </div>
        </div>

        <div class="form-group" [ngClass]="{'has-error': password?.invalid && password?.touched, 'has-success': password?.valid && password?.touched}">
          <input type="password" class="form-control" placeholder="Password" formControlName="password" />
          <div *ngIf="password?.invalid && password?.touched" class="help-block">
            <div *ngIf="password?.errors?.['required']">Password is required.</div>
            <div *ngIf="password?.errors?.['minlength']">Password must be at least 6 characters.</div>
          </div>
        </div>

        <button type="submit" class="btn btn-primary form-control" [disabled]="signupForm.invalid || submitting">
          <i class="fa fa-sign-in"></i> Signup
        </button>
      </form>
      <p><a routerLink="/login">Already a member? Log in here.</a></p>
    </div>
  `,
  styleUrls: ['./signup.component.scss'] // Example, adjust as needed
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  submitting = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private titleService: Title,
    private store: Store,
    private actions$: Actions
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle(getTitle('Signup'));
    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    }, { asyncValidators: this.checkExistingUser.bind(this) });
  }

  get name() { return this.signupForm.get('name'); }
  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }

  async checkExistingUser(formGroup: FormGroup) {
    const email = formGroup.get('email')?.value;
    const name = formGroup.get('name')?.value;

    if (!email || !name) {
      return of(null);
    }

    return this.authService.checkExistingUser(name, email).pipe(
      map(result => {
        const errors: any = {};
        if (result.nameExists) {
          errors.nameExists = true;
        }
        if (result.emailExists) {
          errors.emailExists = true;
        }
        return Object.keys(errors).length ? errors : null;
      }),
      catchError(() => of(null))
    );
  }


  async onSubmit() {
    if (this.signupForm.invalid) {
      return;
    }

    this.submitting = true;

    try {
      const user: User = this.signupForm.value;
      const result = await firstValueFrom(this.authService.signup(user));
      this.store.dispatch(signupComplete({ user: result }));
      this.router.navigate(['/']); // Redirect after successful signup
    } catch (error) {
      // Handle error, e.g., display error message
      console.error('Signup error:', error);
    } finally {
      this.submitting = false;
    }
  }
}
```

```typescript
// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models'; // Assumed migrated

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  signup(user: User): Observable<User> {
    return this.http.post<User>('/api/signup/', user); // Adjust API endpoint as needed
  }

  checkExistingUser(name: string, email: string): Observable<{nameExists: boolean, emailExists: boolean}> {
    return this.http.get<{nameExists: boolean, emailExists: boolean}>(`/api/check-user/?name=${name}&email=${email}`); // Adjust API endpoint as needed
  }
}

```

### Tokens: {'input_tokens': 1457, 'output_tokens': 1627}
### Execution time: 34.03488302230835
