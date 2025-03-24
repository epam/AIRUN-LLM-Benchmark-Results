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
// src/app/actions/auth.actions.ts
import { createAction, props } from '@ngrx/store';

export const signupRequest = createAction(
  '[Auth] Signup Request',
  props<{ name: string; email: string; password: string }>()
);

export const signupSuccess = createAction(
  '[Auth] Signup Success',
  props<{ data: any }>()
);

export const signupFailure = createAction(
  '[Auth] Signup Failure',
  props<{ error: any }>()
);
```

```typescript
// src/app/effects/auth.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../services/auth.service';
import * as AuthActions from '../actions/auth.actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class AuthEffects {
  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signupRequest),
      mergeMap(action =>
        this.authService.signup(action.name, action.email, action.password).pipe(
          map(response => AuthActions.signupSuccess({ data: response.data })),
          catchError(error => of(AuthActions.signupFailure({ error: error.data })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private authService: AuthService) {}
}
```

```typescript
// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  signup(name: string, email: string, password: string): Observable<any> {
    return this.http.post('/api/signup', { name, email, password });
  }

  isName(name: string): Observable<any> {
    return this.http.get('/api/isName', { params: { name } });
  }

  isEmail(email: string): Observable<any> {
    return this.http.get('/api/isEmail', { params: { email } });
  }
}
```

```typescript
// src/app/components/signup/signup.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, of, timer } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import * as AuthActions from '../../actions/auth.actions';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private store: Store<any>,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(60)],
        [this.nameAsyncValidator()]
      ],
      email: [
        '',
        [Validators.required, Validators.email],
        [this.emailAsyncValidator()]
      ],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  nameAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      return timer(500).pipe(
        switchMap(() =>
          this.authService.isName(control.value).pipe(
            map(response =>
              response.data ? { nameTaken: 'This name is already in use' } : null
            ),
            catchError(() => of(null))
          )
        )
      );
    };
  }

  emailAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      return timer(500).pipe(
        switchMap(() =>
          this.authService.isEmail(control.value).pipe(
            map(response =>
              response.data ? { emailTaken: 'This email is already in use' } : null
            ),
            catchError(() => of(null))
          )
        )
      );
    };
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      return;
    }
    this.submitting = true;
    const { name, email, password } = this.signupForm.value;
    this.store.dispatch(AuthActions.signupRequest({ name, email, password }));
    this.store.select('auth').subscribe(state => {
      if (state.error) {
        this.submitting = false;
      }
      if (state.user) {
        this.submitting = false;
        this.router.navigate(['/']);
      }
    });
  }

  get name() {
    return this.signupForm.get('name');
  }

  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }
}
```

```html
<!-- src/app/components/signup/signup.component.html -->
<div class="container">
  <h2>Join PodBaby today.</h2>
  <hr />
  <p class="lead">
    As a member you can subscribe to podcast feeds and keep track of your favorite episodes.
  </p>
  <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" novalidate>
    <div class="form-group" [ngClass]="{'has-error': name.invalid && (name.dirty || name.touched), 'has-success': name.valid && (name.dirty || name.touched)}">
      <input type="text" class="form-control" placeholder="Name" formControlName="name" />
      <div *ngIf="name.invalid && (name.dirty || name.touched)" class="help-block">
        <div *ngIf="name.errors?.required">Name is required</div>
        <div *ngIf="name.errors?.minlength || name.errors?.maxlength">Name must be between 3 and 60 characters in length</div>
        <div *ngIf="name.errors?.nameTaken">{{ name.errors.nameTaken }}</div>
      </div>
    </div>
    <div class="form-group" [ngClass]="{'has-error': email.invalid && (email.dirty || email.touched), 'has-success': email.valid && (email.dirty || email.touched)}">
      <input type="email" class="form-control" placeholder="Email address" formControlName="email" />
      <div *ngIf="email.invalid && (email.dirty || email.touched)" class="help-block">
        <div *ngIf="email.errors?.required">Email is required</div>
        <div *ngIf="email.errors?.email">A valid email address is required</div>
        <div *ngIf="email.errors?.emailTaken">{{ email.errors.emailTaken }}</div>
      </div>
    </div>
    <div class="form-group" [ngClass]="{'has-error': password.invalid && (password.dirty || password.touched), 'has-success': password.valid && (password.dirty || password.touched)}">
      <input type="password" class="form-control" placeholder="Password" formControlName="password" />
      <div *ngIf="password.invalid && (password.dirty || password.touched)" class="help-block">
        <div *ngIf="password.errors?.required">Password is required</div>
        <div *ngIf="password.errors?.minlength">Password must be at least 6 characters</div>
      </div>
    </div>
    <button type="submit" class="btn btn-primary form-control" [disabled]="submitting">
      <i class="fa fa-sign-in"></i> Signup
    </button>
  </form>
  <p>
    <a routerLink="/login">Already a member? Log in here.</a>
  </p>
</div>
```

### Tokens: {'input_tokens': 1485, 'output_tokens': 4957, 'reasoning_tokens': 3200}
### Execution time: 50.653825998306274
