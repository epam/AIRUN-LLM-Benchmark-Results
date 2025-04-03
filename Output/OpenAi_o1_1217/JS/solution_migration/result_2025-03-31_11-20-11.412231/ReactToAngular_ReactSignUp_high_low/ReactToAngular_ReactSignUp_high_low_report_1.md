I have the following application code that needs to migrate:

<source_code>
```js
// signup.js
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

```js
// form.js
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

</source_code>

Please follow these steps:

1. Migrate the provided React code to Angular 14.x:
   - Assume all non-provided code has been migrated with the same contract
   - Implement equivalent functionality while following Angular best practices

2. Architecture requirements:
   - Use @ngrx/store and @ngrx/effects where appropriate for state management
   - Split large files into separate components or functions
   - Maintain the same validation logic and error handling

3. Form implementation:
   - Convert Redux Form to Angular Reactive Forms
   - Implement equivalent form validation (both synchronous and asynchronous)
   - Preserve all validation rules and error messages
   - Maintain field-level validation behavior

4. Component structure:
   - Create equivalent Angular components for each React component
   - Implement proper component lifecycle methods
   - Maintain parent-child component relationships

5. Routing:
   - Convert React Router links to Angular Router navigation
   - Preserve all route paths and navigation logic

6. API integration:
   - Maintain all API calls using Angular HttpClient
   - Preserve promise-based logic as Observable patterns
   - Implement proper error handling

7. UI requirements:
   - Convert React Bootstrap components to Angular equivalents
   - Maintain the same visual appearance and layout
   - Preserve all icons and visual elements

8. Code quality:
   - Optimize code where possible
   - Do not include any TODOs in the final code
   - Follow Angular style guide and best practices

9. Deliverable format:
   - Return translated code as markdown code snippets
   - Provide complete implementation without additional comments or explanations
## Run 1:
### Answer:
```markdown
```ts
// src/app/store/auth.actions.ts
import { createAction, props } from '@ngrx/store';

export const signup = createAction(
  '[Auth] Signup',
  props<{ name: string; email: string; password: string }>()
);

export const signupSuccess = createAction(
  '[Auth] Signup Success',
  props<{ userData: any }>()
);

export const signupFailure = createAction(
  '[Auth] Signup Failure',
  props<{ error: any }>()
);
```
```
```ts
// src/app/store/auth.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiService } from '../services/api.service';
import { signup, signupSuccess, signupFailure } from './auth.actions';

@Injectable()
export class AuthEffects {
  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signup),
      mergeMap((action) =>
        this.apiService.signup(action.name, action.email, action.password).pipe(
          map((userData) => signupSuccess({ userData })),
          catchError((error) => of(signupFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private apiService: ApiService
  ) {}
}
```
```
```ts
// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  signup(name: string, email: string, password: string): Observable<any> {
    return this.http.post<any>('/api/signup', { name, email, password });
  }

  isName(name: string): Observable<{ data: boolean }> {
    return this.http.get<{ data: boolean }>(`/api/isName?name=${name}`);
  }

  isEmail(email: string): Observable<{ data: boolean }> {
    return this.http.get<{ data: boolean }>(`/api/isEmail?email=${email}`);
  }
}
```
```
```ts
// src/app/components/form-group/form-group.component.ts
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-group',
  template: `
    <div class="mb-3">
      <ng-content></ng-content>
      <div *ngIf="control.invalid && control.touched" class="text-danger">
        <span *ngIf="control.errors?.nameTaken">This name is already in use</span>
        <span *ngIf="control.errors?.emailTaken">This email is already in use</span>
        <span *ngIf="control.errors?.required">This field is required</span>
        <span *ngIf="control.errors?.invalidEmail">A valid email address is required</span>
        <span *ngIf="control.errors?.minlength">Password must be at least 6 characters</span>
        <span *ngIf="control.errors?.nameLength">Name must be between 3 and 60 characters in length</span>
      </div>
    </div>
  `,
})
export class FormGroupComponent {
  @Input() control!: FormControl;
}
```
```
```ts
// src/app/components/signup/signup.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { signup } from '../../store/auth.actions';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  template: `
    <div>
      <h2>Join PodBaby today.</h2>
      <hr />
      <p class="lead">
        As a member you can subscribe to podcast feeds and keep track of your favorite episodes.
      </p>
      <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
        <app-form-group [control]="signupForm.controls['name']">
          <input
            type="text"
            class="form-control"
            placeholder="Name"
            formControlName="name"
          />
        </app-form-group>

        <app-form-group [control]="signupForm.controls['email']">
          <input
            type="email"
            class="form-control"
            placeholder="Email address"
            formControlName="email"
          />
        </app-form-group>

        <app-form-group [control]="signupForm.controls['password']">
          <input
            type="password"
            class="form-control"
            placeholder="Password"
            formControlName="password"
          />
        </app-form-group>

        <button
          class="btn btn-primary form-control"
          [disabled]="signupForm.invalid || submitting"
          type="submit"
        >
          <i class="bi bi-box-arrow-in-right"></i> Signup
        </button>
      </form>
      <p>
        <a [routerLink]="['/login']">Already a member? Log in here.</a>
      </p>
    </div>
  `
})
export class SignupComponent implements OnInit {
  signupForm = this.fb.group({
    name: [
      '',
      [this.validateNameLength],
      [this.uniqueNameValidator()]
    ],
    email: [
      '',
      [this.validateEmail],
      [this.uniqueEmailValidator()]
    ],
    password: [
      '',
      [Validators.required, Validators.minLength(6)]
    ],
  });

  submitting = false;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit(): void {
    if (!this.signupForm.valid) {
      return;
    }
    this.submitting = true;
    const { name, email, password } = this.signupForm.value;
    this.store.dispatch(signup({ name: name || '', email: email || '', password: password || '' }));
  }

  validateNameLength(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    if (value.length < 3 || value.length > 60) {
      return { nameLength: true };
    }
    return null;
  }

  validateEmail(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      return { required: true };
    }
    if (!emailRegex.test(value)) {
      return { invalidEmail: true };
    }
    return null;
  }

  uniqueNameValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value || '';
      if (!value) {
        return of(null);
      }
      return this.apiService.isName(value).pipe(
        map((res) => (res.data ? { nameTaken: true } : null))
      );
    };
  }

  uniqueEmailValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value || '';
      if (!value) {
        return of(null);
      }
      return this.apiService.isEmail(value).pipe(
        map((res) => (res.data ? { emailTaken: true } : null))
      );
    };
  }
}
```
```
```ts
// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';

const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', loadChildren: () => import('./components/login/login.module').then(m => m.LoginModule) },
  { path: '', redirectTo: 'signup', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```
```

### Tokens: {'input_tokens': 1485, 'output_tokens': 3344, 'reasoning_tokens': 1536}
### Execution time: 61.44749689102173
