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
// signup.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppState } from '../app.state';
import { signup } from '../actions/auth.actions';
import { isNameTaken, isEmailTaken } from '../selectors/auth.selectors';
import { validateEmail } from '../validators/email.validator';
import { minLength, maxLength } from '../validators/length.validator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  nameTaken$: Observable<boolean>;
  emailTaken$: Observable<boolean>;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, minLength(3), maxLength(60)]],
      email: ['', [Validators.required, validateEmail]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.nameTaken$ = this.signupForm.get('name').valueChanges.pipe(
      map(name => isNameTaken(name))
    );

    this.emailTaken$ = this.signupForm.get('email').valueChanges.pipe(
      map(email => isEmailTaken(email))
    );
  }

  onSubmit() {
    this.submitting = true;
    this.store.dispatch(signup(this.signupForm.value));
  }
}

// signup.component.html
<div>
  <h2>Join PodBaby today.</h2>
  <hr />
  <p class="lead">
    As a member you can subscribe to podcast feeds and keep track of your favorite episodes.
  </p>
  <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
    <app-form-group [field]="signupForm.get('name')">
      <input type="text" class="form-control" placeholder="Name" formControlName="name" />
    </app-form-group>

    <app-form-group [field]="signupForm.get('email')">
      <input type="email" class="form-control" placeholder="Email address" formControlName="email" />
    </app-form-group>

    <app-form-group [field]="signupForm.get('password')">
      <input type="password" class="form-control" placeholder="Password" formControlName="password" />
    </app-form-group>
    <button
      type="submit"
      class="btn btn-primary form-control"
      [disabled]="submitting"
    >
      Signup
    </button>
  </form>
  <p><a routerLink="/login/">Already a member? Log in here.</a></p>
</div>

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

// auth.actions.ts
import { createAction, props } from '@ngrx/store';

export const signup = createAction(
  '[Auth] Signup',
  props<{ name: string; email: string; password: string }>()
);

// auth.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { authFeatureKey, AuthState } from './auth.reducer';

const selectAuthState = createFeatureSelector<AuthState>(authFeatureKey);

export const isNameTaken = (name: string) =>
  createSelector(selectAuthState, state => state.names.includes(name));

export const isEmailTaken = (email: string) =>
  createSelector(selectAuthState, state => state.emails.includes(email));

// auth.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { signup } from '../actions/auth.actions';

export interface AuthState {
  names: string[];
  emails: string[];
}

export const authFeatureKey = 'auth';

export const initialState: AuthState = {
  names: [],
  emails: []
};

export const authReducer = createReducer(
  initialState,
  on(signup, (state, { name, email }) => ({
    ...state,
    names: [...state.names, name],
    emails: [...state.emails, email]
  }))
);

// email.validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import * as validator from 'validator';

export const validateEmail: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!validator.isEmail(control.value)) {
    return { email: 'A valid email address is required' };
  }
  return null;
};

// length.validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const minLength = (min: number): ValidatorFn => (control: AbstractControl): ValidationErrors | null => {
  if (control.value.length < min) {
    return { minlength: `Must be at least ${min} characters long` };
  }
  return null;
};

export const maxLength = (max: number): ValidatorFn => (control: AbstractControl): ValidationErrors | null => {
  if (control.value.length > max) {
    return { maxlength: `Must be no more than ${max} characters long` };
  }
  return null;
};
```

### Tokens: {'input_tokens': 1335, 'output_tokens': 1326}
### Execution time: 19.0507709980011
