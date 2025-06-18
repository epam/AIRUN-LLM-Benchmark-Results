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
// src/app/api/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  isName(name: string): Observable<boolean> {
    return this.http.get<{ data: boolean }>(`/api/name/${encodeURIComponent(name)}`)
      .pipe(map(res => res.data));
  }

  isEmail(email: string): Observable<boolean> {
    return this.http.get<{ data: boolean }>(`/api/email/${encodeURIComponent(email)}`)
      .pipe(map(res => res.data));
  }

  signup(name: string, email: string, password: string): Observable<any> {
    return this.http.post('/api/signup', { name, email, password });
  }
}
```

```ts
// src/app/store/auth/auth.actions.ts
import { createAction, props } from '@ngrx/store';

export const signup = createAction(
  '[Auth] Signup',
  props<{ name: string; email: string; password: string }>()
);

export const signupComplete = createAction(
  '[Auth] Signup Complete',
  props<{ user: any }>()
);

export const signupFailed = createAction(
  '[Auth] Signup Failed',
  props<{ error: any }>()
);
```

```ts
// src/app/store/auth/auth.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

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
  on(AuthActions.signupComplete, (state, { user }) => ({ ...state, user, loading: false })),
  on(AuthActions.signupFailed, (state, { error }) => ({ ...state, loading: false, error }))
);
```

```ts
// src/app/store/auth/auth.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ApiService } from '../../api/api.service';
import * as AuthActions from './auth.actions';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class AuthEffects {
  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signup),
      switchMap(({ name, email, password }) =>
        this.api.signup(name, email, password).pipe(
          map(user => AuthActions.signupComplete({ user })),
          catchError(error => of(AuthActions.signupFailed({ error })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private api: ApiService) {}
}
```

```ts
// src/app/shared/form-group/form-group.component.ts
import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-group',
  templateUrl: './form-group.component.html'
})
export class FormGroupComponent {
  @Input() control!: AbstractControl;
}
```

```html
<!-- src/app/shared/form-group/form-group.component.html -->
<div class="form-group has-feedback"
     [ngClass]="{
       'has-error': control.touched && control.invalid,
       'has-success': control.touched && control.valid
     }">
  <ng-content></ng-content>
  <span *ngIf="control.touched && control.invalid" class="help-block">
    {{ control.errors | errorMessage }}
  </span>
</div>
```

```ts
// src/app/shared/pipes/error-message.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Pipe({ name: 'errorMessage' })
export class ErrorMessagePipe implements PipeTransform {
  transform(errors: ValidationErrors | null): string | null {
    if (!errors) return null;
    if (errors['required']) return 'This field is required';
    if (errors['nameLength']) return 'Name must be between 3 and 60 characters in length';
    if (errors['email']) return 'A valid email address is required';
    if (errors['passwordLength']) return 'Password must be at least 6 characters';
    if (errors['nameTaken']) return 'This name is already in use';
    if (errors['emailTaken']) return 'This email is already in use';
    return null;
  }
}
```

```ts
// src/app/signup/signup.component.ts
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Store } from '@ngrx/store';
import { debounceTime, map, switchMap, first } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import * as AuthActions from '../store/auth/auth.actions';
import { ApiService } from '../api/api.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent implements OnInit {

  form = this.fb.group({
    name: ['', {
      validators: [
        Validators.required,
        this.nameLengthValidator()
      ],
      asyncValidators: [this.nameTakenValidator()],
      updateOn: 'blur'
    }],
    email: ['', {
      validators: [
        Validators.required,
        Validators.email
      ],
      asyncValidators: [this.emailTakenValidator()],
      updateOn: 'blur'
    }],
    password: ['', [
      Validators.required,
      this.passwordLengthValidator()
    ]]
  });

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private api: ApiService,
    private title: Title,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.title.setTitle('Signup | PodBaby');
  }

  submit(): void {
    if (this.form.invalid) return;
    const { name, email, password } = this.form.value;
    this.store.dispatch(AuthActions.signup({ name, email, password }));
  }

  private nameLengthValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value || '';
      return value.length >= 3 && value.length <= 60 ? null : { nameLength: true };
    };
  }

  private passwordLengthValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value || '';
      return value.length >= 6 ? null : { passwordLength: true };
    };
  }

  private nameTakenValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);
      return of(control.value).pipe(
        debounceTime(300),
        switchMap(name => this.api.isName(name)),
        map(isTaken => (isTaken ? { nameTaken: true } : null)),
        first()
      );
    };
  }

  private emailTakenValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);
      return of(control.value).pipe(
        debounceTime(300),
        switchMap(email => this.api.isEmail(email)),
        map(isTaken => (isTaken ? { emailTaken: true } : null)),
        first()
      );
    };
  }
}
```

```html
<!-- src/app/signup/signup.component.html -->
<h2>Join PodBaby today.</h2>
<hr />
<p class="lead">
  As a member you can subscribe to podcast feeds and keep track of your favorite episodes.
</p>

<form [formGroup]="form" class="form-horizontal" (ngSubmit)="submit()">
  <app-form-group [control]="form.get('name')">
    <input type="text" class="form-control" placeholder="Name" formControlName="name">
  </app-form-group>

  <app-form-group [control]="form.get('email')">
    <input type="email" class="form-control" placeholder="Email address" formControlName="email">
  </app-form-group>

  <app-form-group [control]="form.get('password')">
    <input type="password" class="form-control" placeholder="Password" formControlName="password">
  </app-form-group>

  <button class="btn btn-primary form-control" type="submit" [disabled]="form.pending || form.invalid">
    <i class="fa fa-sign-in"></i> Signup
  </button>
</form>

<p><a routerLink="/login/">Already a member? Log in here.</a></p>
```

```ts
// src/app/signup/signup-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup.component';

const routes: Routes = [
  { path: '', component: SignupComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignupRoutingModule {}
```

```ts
// src/app/signup/signup.module.ts
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup.component';
import { SignupRoutingModule } from './signup-routing.module';
import { FormGroupComponent } from '../shared/form-group/form-group.component';
import { ErrorMessagePipe } from '../shared/pipes/error-message.pipe';

@NgModule({
  declarations: [
    SignupComponent,
    FormGroupComponent,
    ErrorMessagePipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SignupRoutingModule
  ]
})
export class SignupModule {}
```

```ts
// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'signup', loadChildren: () => import('./signup/signup.module').then(m => m.SignupModule) },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
  { path: '**', redirectTo: 'signup' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```

```ts
// src/app/app.module.ts
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { authReducer } from './store/auth/auth.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot({ auth: authReducer }),
    EffectsModule.forRoot([AuthEffects])
  ],
  providers: [Title],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

```ts
// src/app/app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {}
```

### Tokens: {'input_tokens': 1485, 'output_tokens': 3440, 'reasoning_tokens': 896}
### Execution time: 365.9254779815674
