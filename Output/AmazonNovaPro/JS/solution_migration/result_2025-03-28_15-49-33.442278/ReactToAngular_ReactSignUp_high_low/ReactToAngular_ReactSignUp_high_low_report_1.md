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
```typescript
// signup.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import * as authActions from '../store/auth.actions';
import { AppState } from '../store/app.state';
import { ValidatorService } from '../services/validator.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  submitting = false;
  errors: any = {};

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store<AppState>,
    private http: HttpClient,
    private validatorService: ValidatorService
  ) {}

  ngOnInit() {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    }, { validator: this.validatorService.asyncValidator });

    this.signupForm.statusChanges.subscribe(() => {
      this.errors = {};
    });
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      return;
    }

    this.submitting = true;
    const { name, email, password } = this.signupForm.value;

    this.http.post(`${environment.apiUrl}/signup`, { name, email, password })
      .pipe(
        switchMap(result => {
          this.store.dispatch(authActions.signupComplete({ data: result }));
          return of(result);
        }),
        catchError(error => {
          this.errors = error.error;
          return of(error.error);
        }),
        finalize(() => this.submitting = false)
      )
      .subscribe();
  }

  get name() { return this.signupForm.get('name'); }
  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }
}
```

```typescript
// validator.service.ts
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {
  constructor(private http: HttpClient) {}

  asyncValidator: AsyncValidatorFn = (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
    const { name, email } = control.value;

    const checkName = name ? this.http.get(`${environment.apiUrl}/isName/${name}`)
      .pipe(
        map(result => result ? { name: 'This name is already in use' } : null),
        catchError(() => of(null))
      ) : of(null);

    const checkEmail = email ? this.http.get(`${environment.apiUrl}/isEmail/${email}`)
      .pipe(
        map(result => result ? { email: 'This email is already in use' } : null),
        catchError(() => of(null))
      ) : of(null);

    return this.http.forkJoin([checkEmail, checkName]).pipe(
      map(results => {
        const errors: { [key: string]: any } = {};
        results.forEach(result => {
          if (result) {
            Object.assign(errors, result);
          }
        });
        return Object.keys(errors).length ? errors : null;
      })
    );
  };
}
```

```html
<!-- signup.component.html -->
<div>
  <h2>Join PodBaby today.</h2>
  <hr />
  <p class="lead">
    As a member you can subscribe to podcast feeds and keep track of your favorite episodes.
  </p>
  <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
    <app-form-group [field]="name">
      <input type="text" class="form-control" placeholder="Name" formControlName="name" />
    </app-form-group>

    <app-form-group [field]="email">
      <input type="email" class="form-control" placeholder="Email address" formControlName="email" />
    </app-form-group>

    <app-form-group [field]="password">
      <input type="password" class="form-control" placeholder="Password" formControlName="password" />
    </app-form-group>
    <button
      type="submit"
      class="btn btn-primary form-control"
      [disabled]="submitting">
      <i class="icon-sign-in"></i> Signup
    </button>
  </form>
  <p><a routerLink="/login/">Already a member? Log in here.</a></p>
</div>
```

```typescript
// form-group.component.ts
import { Component, Input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-form-group',
  template: `
    <div [ngClass]="{'has-error': hasError, 'has-success': hasSuccess}">
      <ng-content></ng-content>
      <div *ngIf="hasError" class="help-block">{{ errorMessage }}</div>
    </div>
  `
})
export class FormGroupComponent {
  @Input() field: AbstractControl;

  get hasError(): boolean {
    return this.field.touched && this.field.invalid;
  }

  get hasSuccess(): boolean {
    return this.field.touched && this.field.valid;
  }

  get errorMessage(): string {
    const errors = this.field.errors as ValidationErrors;
    return Object.values(errors).join(', ');
  }
}
```

```typescript
// auth.actions.ts
import { createAction, props } from '@ngrx/store';

export const signupComplete = createAction(
  '[Auth] Signup Complete',
  props<{ data: any }>()
);
```

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { FormGroupComponent } from './form-group/form-group.component';
import { authReducer } from './store/auth.reducer';
import { AuthEffects } from './store/auth.effects';
import { ValidatorService } from './services/validator.service';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    FormGroupComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'signup', component: SignupComponent },
      { path: 'login', component: SignupComponent } // Placeholder for actual login route
    ]),
    StoreModule.forRoot({ auth: authReducer }),
    EffectsModule.forRoot([AuthEffects])
  ],
  providers: [ValidatorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

```typescript
// auth.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as authActions from './auth.actions';

export interface AuthState {
  isSignedUp: boolean;
}

export const initialState: AuthState = {
  isSignedUp: false
};

export const authReducer = createReducer(
  initialState,
  on(authActions.signupComplete, state => ({ ...state, isSignedUp: true }))
);
```

```typescript
// auth.effects.ts
import { Injectable } from '@angular/core';
import

### Tokens: {'input_tokens': 1556, 'output_tokens': 2000}
### Execution time: 23.289467096328735
