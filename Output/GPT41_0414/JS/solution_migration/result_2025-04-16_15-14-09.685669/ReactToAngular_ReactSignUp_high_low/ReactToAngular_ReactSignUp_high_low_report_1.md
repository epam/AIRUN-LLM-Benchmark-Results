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
```typescript
// signup.component.ts
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AppState } from '../store/app.state';
import { signup, signupComplete } from '../store/auth/auth.actions';
import { selectAuthSubmitting } from '../store/auth/auth.selectors';
import { ApiService } from '../api/api.service';
import { getTitle } from '../utils/title.util';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  submitting$: Observable<boolean>;
  title = getTitle('Signup');

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(60)
      ], [this.nameAsyncValidator()]],
      email: ['', [
        Validators.required,
        Validators.email
      ], [this.emailAsyncValidator()]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]
    });

    this.submitting$ = this.store.select(selectAuthSubmitting);
  }

  nameAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value || control.value.length < 3) {
        return of(null);
      }
      return timer(300).pipe(
        switchMap(() => this.api.isName(control.value)),
        map(result => result.data ? { nameTaken: 'This name is already in use' } : null),
        catchError(() => of(null))
      );
    };
  }

  emailAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      return timer(300).pipe(
        switchMap(() => this.api.isEmail(control.value)),
        map(result => result.data ? { emailTaken: 'This email is already in use' } : null),
        catchError(() => of(null))
      );
    };
  }

  get name() { return this.signupForm.get('name'); }
  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    const { name, email, password } = this.signupForm.value;
    this.store.dispatch(signup({ name, email, password }));
  }

  navigateToLogin(): void {
    this.router.navigate(['/login/']);
  }
}
```

```html
<!-- signup.component.html -->
<ng-container>
  <h2>Join PodBaby today.</h2>
  <hr />
  <p class="lead">
    As a member you can subscribe to podcast feeds and keep track of your favorite episodes.
  </p>
  <form [formGroup]="signupForm" class="form-horizontal" (ngSubmit)="onSubmit()">
    <app-form-group [control]="name" label="Name">
      <input type="text" class="form-control" placeholder="Name" formControlName="name" />
    </app-form-group>

    <app-form-group [control]="email" label="Email address">
      <input type="email" class="form-control" placeholder="Email address" formControlName="email" />
    </app-form-group>

    <app-form-group [control]="password" label="Password">
      <input type="password" class="form-control" placeholder="Password" formControlName="password" />
    </app-form-group>

    <button
      class="btn btn-primary form-control"
      [disabled]="signupForm.invalid || (submitting$ | async)"
      type="submit"
    >
      <app-icon icon="sign-in"></app-icon> Signup
    </button>
  </form>
  <p>
    <a (click)="navigateToLogin()" routerLink="/login/">Already a member? Log in here.</a>
  </p>
</ng-container>
```

```typescript
// form-group.component.ts
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-group',
  templateUrl: './form-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormGroupComponent {
  @Input() control: AbstractControl;
  @Input() label: string;
}
```

```html
<!-- form-group.component.html -->
<div class="form-group" [ngClass]="{
  'has-error': control.touched && control.invalid,
  'has-success': control.touched && control.valid
}">
  <label *ngIf="label">{{ label }}</label>
  <ng-content></ng-content>
  <span *ngIf="control.touched && control.errors" class="help-block">
    <ng-container *ngIf="control.errors.required">This field is required</ng-container>
    <ng-container *ngIf="control.errors.minlength">Name must be between 3 and 60 characters in length</ng-container>
    <ng-container *ngIf="control.errors.maxlength">Name must be between 3 and 60 characters in length</ng-container>
    <ng-container *ngIf="control.errors.email">A valid email address is required</ng-container>
    <ng-container *ngIf="control.errors.nameTaken">{{ control.errors.nameTaken }}</ng-container>
    <ng-container *ngIf="control.errors.emailTaken">{{ control.errors.emailTaken }}</ng-container>
    <ng-container *ngIf="control.errors.minlength && control.parent?.get('password') === control">Password must be at least 6 characters</ng-container>
  </span>
</div>
```

```typescript
// api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  isName(name: string): Observable<{ data: boolean }> {
    return this.http.get<{ data: boolean }>(`/api/is-name/${encodeURIComponent(name)}`);
  }

  isEmail(email: string): Observable<{ data: boolean }> {
    return this.http.get<{ data: boolean }>(`/api/is-email/${encodeURIComponent(email)}`);
  }

  signup(name: string, email: string, password: string): Observable<any> {
    return this.http.post('/api/signup', { name, email, password });
  }
}
```

```typescript
// store/auth/auth.actions.ts
import { createAction, props } from '@ngrx/store';

export const signup = createAction(
  '[Auth] Signup',
  props<{ name: string; email: string; password: string }>()
);

export const signupComplete = createAction(
  '[Auth] Signup Complete',
  props<{ user: any }>()
);

export const signupFailure = createAction(
  '[Auth] Signup Failure',
  props<{ error: any }>()
);
```

```typescript
// store/auth/auth.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ApiService } from '../../api/api.service';
import { signup, signupComplete, signupFailure } from './auth.actions';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class AuthEffects {
  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signup),
      switchMap(({ name, email, password }) =>
        this.api.signup(name, email, password).pipe(
          map(user => signupComplete({ user })),
          catchError(error => of(signupFailure({ error: error.error })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private api: ApiService) {}
}
```

```typescript
// store/auth/auth.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { signup, signupComplete, signupFailure } from './auth.actions';

export interface AuthState {
  submitting: boolean;
  user: any;
  error: any;
}

export const initialState: AuthState = {
  submitting: false,
  user: null,
  error: null
};

export const authReducer = createReducer(
  initialState,
  on(signup, state => ({ ...state, submitting: true, error: null })),
  on(signupComplete, (state, { user }) => ({ ...state, submitting: false, user })),
  on(signupFailure, (state, { error }) => ({ ...state, submitting: false, error }))
);
```

```typescript
// store/auth/auth.selectors.ts
import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

export const selectAuthState = (state: AppState) => state.auth;

export const selectAuthSubmitting = createSelector(
  selectAuthState,
  auth => auth.submitting
);
```

```typescript
// app-icon.component.ts
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-icon',
  template: `<i [ngClass]="'fa fa-' + icon"></i>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent {
  @Input() icon: string;
}
```

```typescript
// utils/title.util.ts
export function getTitle(page: string): string {
  return `${page} - PodBaby`;
}
```

```typescript
// app-routing.module.ts (excerpt)
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```


### Tokens: {'input_tokens': 1486, 'output_tokens': 2273, 'reasoning_tokens': 0}
### Execution time: 46.292052030563354
