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
// src/app/models/user.model.ts
export interface User {
  id: string;
  name: string;
  email: string;
}
```

```typescript
// src/app/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './models/user.model';

interface ApiResponse<T> {
  data: T;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  isName(name: string): Observable<ApiResponse<boolean>> {
    return this.http.get<ApiResponse<boolean>>(`/api/is-name/${name}`);
  }

  isEmail(email: string): Observable<ApiResponse<boolean>> {
    return this.http.get<ApiResponse<boolean>>(`/api/is-email/${email}`);
  }

  signup(name: string, email: string, password: string): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`/api/signup`, { name, email, password });
  }
}
```

```typescript
// src/app/auth/auth.actions.ts
import { createAction, props } from '@ngrx/store';
import { User } from '../models/user.model';

export const signup = createAction(
  '[Auth] Signup',
  props<{ name: string; email: string; password: string }>()
);
export const signupSuccess = createAction(
  '[Auth] Signup Success',
  props<{ user: User }>()
);
export const signupFailure = createAction(
  '[Auth] Signup Failure',
  props<{ error: any }>()
);
```

```typescript
// src/app/auth/auth.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { User } from '../models/user.model';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: any;
}

export const initialAuthState: AuthState = {
  user: null,
  loading: false,
  error: null
};

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.signup, state => ({ ...state, loading: true, error: null })),
  on(AuthActions.signupSuccess, (state, { user }) => ({ ...state, user, loading: false })),
  on(AuthActions.signupFailure, (state, { error }) => ({ ...state, error, loading: false }))
);
```

```typescript
// src/app/auth/auth.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');
export const selectAuthLoading = createSelector(selectAuthState, s => s.loading);
export const selectAuthError = createSelector(selectAuthState, s => s.error);
```

```typescript
// src/app/auth/auth.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { ApiService } from '../api.service';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class AuthEffects {
  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signup),
      mergeMap(action =>
        this.api.signup(action.name, action.email, action.password).pipe(
          map(res => AuthActions.signupSuccess({ user: res.data })),
          catchError(err => of(AuthActions.signupFailure({ error: err.error })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private api: ApiService) {}
}
```

```typescript
// src/app/signup/signup.component.ts
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AsyncValidatorFn,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { signup } from '../auth/auth.actions';
import { selectAuthLoading, selectAuthError } from '../auth/auth.selectors';
import { ApiService } from '../api.service';
import { AppState } from '../app.state';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent implements OnInit {
  form: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<any>;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.loading$ = this.store.select(selectAuthLoading);
    this.error$ = this.store.select(selectAuthError);
    this.form = this.fb.group(
      {
        name: [
          '',
          [Validators.required, Validators.minLength(3), Validators.maxLength(60)],
          [this.uniqueNameValidator()]
        ],
        email: [
          '',
          [Validators.required, Validators.email],
          [this.uniqueEmailValidator()]
        ],
        password: ['', [Validators.required, Validators.minLength(6)]]
      },
      { updateOn: 'blur' }
    );
    this.error$.subscribe(err => {
      if (err && typeof err === 'object') {
        Object.keys(err).forEach(field => {
          const c = this.form.get(field);
          if (c) {
            c.setErrors({ serverError: err[field] });
          }
        });
      }
    });
  }

  uniqueNameValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) {
        return of(null);
      }
      return this.api.isName(control.value).pipe(
        map(res => (res.data ? { uniqueName: 'This name is already in use' } : null)),
        catchError(() => of(null))
      );
    };
  }

  uniqueEmailValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) {
        return of(null);
      }
      return this.api.isEmail(control.value).pipe(
        map(res => (res.data ? { uniqueEmail: 'This email is already in use' } : null)),
        catchError(() => of(null))
      );
    };
  }

  onSubmit(): void {
    if (this.form.valid) {
      const { name, email, password } = this.form.value;
      this.store.dispatch(signup({ name, email, password }));
    }
  }
}
```

```html
<!-- src/app/signup/signup.component.html -->
<ng-container *ngIf="loading$ | async; else formTpl">
  <p>Loading...</p>
</ng-container>
<ng-template #formTpl>
  <h2>Join PodBaby today.</h2>
  <hr />
  <p class="lead">
    As a member you can subscribe to podcast feeds and keep track of your favorite episodes.
  </p>
  <form class="form-horizontal" [formGroup]="form" (ngSubmit)="onSubmit()">
    <div
      class="form-group"
      [ngClass]="{
        'has-error': form.get('name').touched && form.get('name').invalid,
        'has-success': form.get('name').touched && form.get('name').valid
      }"
    >
      <input
        formControlName="name"
        type="text"
        class="form-control"
        placeholder="Name"
      />
      <span class="help-block" *ngIf="form.get('name').touched && form.get('name').invalid">
        <span *ngIf="form.get('name').hasError('serverError')">
          {{ form.get('name').getError('serverError') }}
        </span>
        <span *ngIf="form.get('name').hasError('uniqueName')">
          {{ form.get('name').getError('uniqueName') }}
        </span>
        <span
          *ngIf="
            !form.get('name').hasError('serverError') &&
            !form.get('name').hasError('uniqueName')
          "
        >
          Name must be between 3 and 60 characters in length
        </span>
      </span>
    </div>

    <div
      class="form-group"
      [ngClass]="{
        'has-error': form.get('email').touched && form.get('email').invalid,
        'has-success': form.get('email').touched && form.get('email').valid
      }"
    >
      <input
        formControlName="email"
        type="email"
        class="form-control"
        placeholder="Email address"
      />
      <span class="help-block" *ngIf="form.get('email').touched && form.get('email').invalid">
        <span *ngIf="form.get('email').hasError('serverError')">
          {{ form.get('email').getError('serverError') }}
        </span>
        <span *ngIf="form.get('email').hasError('uniqueEmail')">
          {{ form.get('email').getError('uniqueEmail') }}
        </span>
        <span
          *ngIf="
            !form.get('email').hasError('serverError') &&
            !form.get('email').hasError('uniqueEmail')
          "
        >
          A valid email address is required
        </span>
      </span>
    </div>

    <div
      class="form-group"
      [ngClass]="{
        'has-error': form.get('password').touched && form.get('password').invalid,
        'has-success': form.get('password').touched && form.get('password').valid
      }"
    >
      <input
        formControlName="password"
        type="password"
        class="form-control"
        placeholder="Password"
      />
      <span class="help-block" *ngIf="form.get('password').touched && form.get('password').invalid">
        Password must be at least 6 characters
      </span>
    </div>

    <button
      class="btn btn-primary form-control"
      type="submit"
      [disabled]="loading$ | async"
    >
      <i class="glyphicon glyphicon-sign-in"></i> Signup
    </button>
  </form>
  <p><a routerLink="/login">Already a member? Log in here.</a></p>
</ng-template>
```

```typescript
// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'signup' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```

```typescript
// src/app/app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {}
```

```typescript
// src/app/app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { authReducer } from './auth/auth.reducer';
import { AuthEffects } from './auth/auth.effects';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot({ auth: authReducer }),
    EffectsModule.forRoot([AuthEffects])
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

### Tokens: {'input_tokens': 1485, 'output_tokens': 10217, 'reasoning_tokens': 7552}
### Execution time: 115.85678720474243
