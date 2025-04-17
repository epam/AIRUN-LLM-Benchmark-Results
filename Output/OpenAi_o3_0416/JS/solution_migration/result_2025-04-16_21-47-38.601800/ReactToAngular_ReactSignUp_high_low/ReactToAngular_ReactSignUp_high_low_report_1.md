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
```ts
// src/app/auth/actions/auth.actions.ts
import { createAction, props } from '@ngrx/store';

export const signup = createAction('[Auth] Signup', props<{ name: string; email: string; password: string }>());
export const signupSuccess = createAction('[Auth] Signup Success', props<{ user: any }>());
export const signupFailure = createAction('[Auth] Signup Failure', props<{ error: any }>());
```

```ts
// src/app/auth/reducers/auth.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as AuthActions from '../actions/auth.actions';

export interface AuthState {
  user: any | null;
  loading: boolean;
  error: any | null;
}

export const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.signup, state => ({ ...state, loading: true, error: null })),
  on(AuthActions.signupSuccess, (state, { user }) => ({ ...state, loading: false, user })),
  on(AuthActions.signupFailure, (state, { error }) => ({ ...state, loading: false, error })),
);
```

```ts
// src/app/auth/selectors/auth.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../reducers/auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAuthLoading = createSelector(selectAuthState, s => s.loading);
export const selectAuthError = createSelector(selectAuthState, s => s.error);
```

```ts
// src/app/auth/effects/auth.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import * as AuthActions from '../actions/auth.actions';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthEffects {
  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signup),
      switchMap(({ name, email, password }) =>
        this.authService.signup(name, email, password).pipe(
          map(user => AuthActions.signupSuccess({ user })),
          catchError(error => of(AuthActions.signupFailure({ error }))),
        ),
      ),
    ),
  );

  signupSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signupSuccess),
        tap(() => this.router.navigate(['/'])),
      ),
    { dispatch: false },
  );

  constructor(private actions$: Actions, private authService: AuthService, private router: Router) {}
}
```

```ts
// src/app/auth/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  signup(name: string, email: string, password: string) {
    return this.http.post<{ data: any }>('/api/signup', { name, email, password }).pipe(map(r => r.data));
  }

  isEmail(email: string) {
    return this.http.get<{ data: boolean }>(`/api/is-email/${encodeURIComponent(email)}`).pipe(map(r => r.data));
  }

  isName(name: string) {
    return this.http.get<{ data: boolean }>(`/api/is-name/${encodeURIComponent(name)}`).pipe(map(r => r.data));
  }
}
```

```ts
// src/app/auth/validators/unique-email.validator.ts
import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, map, catchError, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export function uniqueEmailValidator(authService: AuthService): AsyncValidatorFn {
  return (control: AbstractControl) =>
    of(control.value).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value =>
        !value
          ? of(null)
          : authService.isEmail(value).pipe(
              map(taken => (taken ? { emailTaken: true } : null)),
              catchError(() => of(null)),
            ),
      ),
    );
}
```

```ts
// src/app/auth/validators/unique-name.validator.ts
import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, map, catchError, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export function uniqueNameValidator(authService: AuthService): AsyncValidatorFn {
  return (control: AbstractControl) =>
    of(control.value).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value =>
        !value
          ? of(null)
          : authService.isName(value).pipe(
              map(taken => (taken ? { nameTaken: true } : null)),
              catchError(() => of(null)),
            ),
      ),
    );
}
```

```ts
// src/app/shared/components/form-group/form-group.component.ts
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-group',
  templateUrl: './form-group.component.html',
})
export class FormGroupComponent {
  @Input() control!: FormControl;
}
```

```html
<!-- src/app/shared/components/form-group/form-group.component.html -->
<div class="form-group" [ngClass]="{ 'has-error': control.touched && control.invalid, 'has-success': control.touched && control.valid }">
  <ng-content></ng-content>
  <span *ngIf="control.touched && control.errors" class="help-block">
    {{ control.errors | errorMessage }}
  </span>
</div>
```

```ts
// src/app/shared/pipes/error-message.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'errorMessage' })
export class ErrorMessagePipe implements PipeTransform {
  transform(errors: any): string {
    if (errors?.required) return 'This field is required';
    if (errors?.minlength) return `Minimum length is ${errors.minlength.requiredLength} characters`;
    if (errors?.maxlength) return `Maximum length is ${errors.maxlength.requiredLength} characters`;
    if (errors?.email) return 'A valid email address is required';
    if (errors?.emailTaken) return 'This email is already in use';
    if (errors?.nameTaken) return 'This name is already in use';
    return '';
  }
}
```

```ts
// src/app/auth/signup/signup.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import { uniqueEmailValidator } from '../validators/unique-email.validator';
import { uniqueNameValidator } from '../validators/unique-name.validator';
import * as AuthActions from '../actions/auth.actions';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
})
export class SignupComponent implements OnInit {
  form = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(60)],
      [uniqueNameValidator(this.authService)],
    ],
    email: ['', [Validators.required, Validators.email], [uniqueEmailValidator(this.authService)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private title: Title,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.title.setTitle('Signup | PodBaby');
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const { name, email, password } = this.form.value;
    this.store.dispatch(AuthActions.signup({ name, email, password }));
  }
}
```

```html
<!-- src/app/auth/signup/signup.component.html -->
<h2>Join PodBaby today.</h2>
<hr />
<p class="lead">
  As a member you can subscribe to podcast feeds and keep track of your favorite episodes.
</p>

<form [formGroup]="form" class="form-horizontal" (ngSubmit)="onSubmit()">
  <app-form-group [control]="form.get('name') as any">
    <input type="text" class="form-control" placeholder="Name" formControlName="name" />
  </app-form-group>

  <app-form-group [control]="form.get('email') as any">
    <input type="email" class="form-control" placeholder="Email address" formControlName="email" />
  </app-form-group>

  <app-form-group [control]="form.get('password') as any">
    <input type="password" class="form-control" placeholder="Password" formControlName="password" />
  </app-form-group>

  <button type="submit" class="btn btn-primary form-control" [disabled]="form.pending || form.invalid">
    <i class="fa fa-sign-in"></i> Signup
  </button>
</form>

<p><a routerLink="/login">Already a member? Log in here.</a></p>
```

```ts
// src/app/auth/signup/signup.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './signup.component';
import { StoreModule } from '@ngrx/store';
import { authReducer } from '../reducers/auth.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from '../effects/auth.effects';
import { FormGroupComponent } from '../../shared/components/form-group/form-group.component';
import { ErrorMessagePipe } from '../../shared/pipes/error-message.pipe';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [SignupComponent, FormGroupComponent, ErrorMessagePipe],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: SignupComponent }]),
    StoreModule.forFeature('auth', authReducer),
    EffectsModule.forFeature([AuthEffects]),
  ],
})
export class SignupModule {}
```

```ts
// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'signup',
    loadChildren: () => import('./auth/signup/signup.module').then(m => m.SignupModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then(m => m.LoginModule),
  },
  { path: '**', redirectTo: 'signup' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

```ts
// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({ maxAge: 25 }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

```html
<!-- src/app/app.component.html -->
<router-outlet></router-outlet>
```

### Tokens: {'input_tokens': 1485, 'output_tokens': 3442, 'reasoning_tokens': 832}
### Execution time: 20.687740802764893
