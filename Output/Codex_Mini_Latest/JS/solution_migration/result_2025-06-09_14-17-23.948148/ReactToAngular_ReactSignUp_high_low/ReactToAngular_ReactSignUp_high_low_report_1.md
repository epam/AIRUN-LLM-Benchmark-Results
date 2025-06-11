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
// src/app/auth/+state/auth.actions.ts
import { createAction, props } from '@ngrx/store';

export const signup = createAction(
  '[Auth] Signup',
  props<{ name: string; email: string; password: string }>()
);

export const signupSuccess = createAction(
  '[Auth] Signup Success',
  props<{ user: any }>()
);

export const signupFailure = createAction(
  '[Auth] Signup Failure',
  props<{ errors: { [key: string]: string } }>()
);
```

```typescript
// src/app/auth/+state/auth.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export interface AuthState {
  loading: boolean;
  errors: { [key: string]: string } | null;
  user: any | null;
}

export const initialAuthState: AuthState = {
  loading: false,
  errors: null,
  user: null,
};

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.signup, state => ({ ...state, loading: true, errors: null })),
  on(AuthActions.signupSuccess, (state, { user }) => ({ ...state, loading: false, user })),
  on(AuthActions.signupFailure, (state, { errors }) => ({ ...state, loading: false, errors }))
);
```

```typescript
// src/app/auth/+state/auth.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as AuthActions from './auth.actions';
import { AuthApiService } from '../auth-api.service';

@Injectable()
export class AuthEffects {
  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signup),
      switchMap(({ name, email, password }) =>
        this.api.signup(name, email, password).pipe(
          map(result => AuthActions.signupSuccess({ user: result.data })),
          catchError(err => of(AuthActions.signupFailure({ errors: err.error })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private api: AuthApiService) {}
}
```

```typescript
// src/app/auth/auth-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ApiResponse<T> {
  data: T;
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  constructor(private http: HttpClient) {}

  signup(name: string, email: string, password: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>('/api/signup', { name, email, password });
  }

  isName(name: string): Observable<ApiResponse<boolean>> {
    return this.http.get<ApiResponse<boolean>>(`/api/exists/name/${name}`);
  }

  isEmail(email: string): Observable<ApiResponse<boolean>> {
    return this.http.get<ApiResponse<boolean>>(`/api/exists/email/${email}`);
  }
}
```

```typescript
// src/app/shared/validators/signup-validators.ts
import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AuthApiService } from '../../auth/auth-api.service';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const nameRangeValidator: ValidatorFn = control => {
  const v = control.value as string;
  if (!v || v.length < 3 || v.length > 60) {
    return { nameRange: true };
  }
  return null;
};

export const passwordLengthValidator: ValidatorFn = control => {
  const v = control.value as string;
  if (!v || v.length < 6) {
    return { passwordLength: true };
  }
  return null;
};

@Injectable({ providedIn: 'root' })
export class SignupValidators {
  constructor(private api: AuthApiService) {}

  uniqueName(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      const v = control.value as string;
      if (!v) {
        return of(null);
      }
      return this.api.isName(v).pipe(
        map(res => (res.data ? { nameTaken: true } : null)),
        catchError(() => of(null))
      );
    };
  }

  uniqueEmail(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      const v = control.value as string;
      if (!v) {
        return of(null);
      }
      return this.api.isEmail(v).pipe(
        map(res => (res.data ? { emailTaken: true } : null)),
        catchError(() => of(null))
      );
    };
  }
}
```

```typescript
// src/app/shared/components/form-group/form-group.component.ts
import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-group',
  template: `
    <div class="form-group" [ngClass]="{ 'has-error': control.touched && control.invalid, 'has-success': control.touched && control.valid }">
      <ng-content></ng-content>
      <div *ngIf="control.touched && control.errors" class="help-block">
        {{ firstError }}
      </div>
    </div>
  `
})
export class FormGroupComponent {
  @Input() control!: AbstractControl;

  get firstError(): string {
    if (!this.control.errors) {
      return '';
    }
    const errKey = Object.keys(this.control.errors)[0];
    switch (errKey) {
      case 'required':
        return 'This field is required';
      case 'email':
        return 'A valid email address is required';
      case 'nameRange':
        return 'Name must be between 3 and 60 characters in length';
      case 'passwordLength':
        return 'Password must be at least 6 characters';
      case 'nameTaken':
        return 'This name is already in use';
      case 'emailTaken':
        return 'This email is already in use';
      case 'serverError':
        return this.control.errors['serverError'];
      default:
        return '';
    }
  }
}
```

```typescript
// src/app/auth/signup/signup.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { nameRangeValidator, passwordLengthValidator, SignupValidators } from '../../shared/validators/signup-validators';
import { Store } from '@ngrx/store';
import * as AuthActions from '../+state/auth.actions';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { getTitle } from '../utils';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit, OnDestroy {
  signupForm!: FormGroup;
  submitting = false;
  private sub = new Subscription();

  constructor(
    private fb: FormBuilder,
    private sv: SignupValidators,
    private store: Store,
    private title: Title
  ) {}

  ngOnInit(): void {
    this.title.setTitle(getTitle('Signup'));

    this.signupForm = this.fb.group({
      name: ['', {
        validators: [Validators.required, nameRangeValidator],
        asyncValidators: [this.sv.uniqueName()],
        updateOn: 'blur'
      }],
      email: ['', {
        validators: [Validators.required, Validators.email],
        asyncValidators: [this.sv.uniqueEmail()],
        updateOn: 'blur'
      }],
      password: ['', [Validators.required, passwordLengthValidator]]
    });

    this.sub.add(
      this.store.select(state => state.auth.loading).subscribe(loading => (this.submitting = loading))
    );

    this.sub.add(
      this.store.select(state => state.auth.errors).subscribe(errors => {
        if (errors) {
          Object.keys(errors).forEach(key => {
            const ctrl = this.signupForm.get(key);
            if (ctrl) {
              ctrl.setErrors({ serverError: errors[key] });
            }
          });
        }
      })
    );
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      const { name, email, password } = this.signupForm.value;
      this.store.dispatch(AuthActions.signup({ name, email, password }));
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
```

```html
<!-- src/app/auth/signup/signup.component.html -->
<div>
  <h2>Join PodBaby today.</h2>
  <hr />
  <p class="lead">
    As a member you can subscribe to podcast feeds and keep track of your favorite episodes.
  </p>
  <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="form-horizontal">
    <app-form-group [control]="signupForm.get('name')!">
      <input formControlName="name" type="text" class="form-control" placeholder="Name" />
    </app-form-group>

    <app-form-group [control]="signupForm.get('email')!">
      <input formControlName="email" type="email" class="form-control" placeholder="Email address" />
    </app-form-group>

    <app-form-group [control]="signupForm.get('password')!">
      <input formControlName="password" type="password" class="form-control" placeholder="Password" />
    </app-form-group>

    <button
      type="submit"
      class="btn btn-primary form-control"
      [disabled]="submitting"
    >
      <app-icon name="sign-in"></app-icon> Signup
    </button>
  </form>
  <p><a routerLink="/login">Already a member? Log in here.</a></p>
</div>
```

```typescript
// src/app/auth/auth.module.ts
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './signup/signup.component';
import { FormGroupComponent } from '../shared/components/form-group/form-group.component';
import { IconComponent } from '../shared/components/icon/icon.component';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { authReducer } from './+state/auth.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './+state/auth.effects';

const routes: Routes = [
  { path: 'signup', component: SignupComponent }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('auth', authReducer),
    EffectsModule.forFeature([AuthEffects])
  ],
  declarations: [SignupComponent],
  exports: [SignupComponent]
})
export class AuthModule {}
```

```typescript
// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  // other routes...
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```


### Tokens: {'input_tokens': 1485, 'output_tokens': 5646, 'reasoning_tokens': 3200}
### Execution time: 36.80493998527527
