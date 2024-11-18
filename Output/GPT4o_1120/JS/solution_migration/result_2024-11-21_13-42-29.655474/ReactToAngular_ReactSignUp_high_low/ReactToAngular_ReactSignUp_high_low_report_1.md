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
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';

import { ApiService } from '../services/api.service';
import { AuthActions } from '../store/actions/auth.actions';
import { AppState } from '../store/state/app.state';
import { getTitle } from './utils';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  submitting$: Observable<boolean>;
  asyncValidating$: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private store: Store<AppState>
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)], [this.nameAsyncValidator.bind(this)]],
      email: ['', [Validators.required, Validators.email], [this.emailAsyncValidator.bind(this)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.submitting$ = this.store.select(state => state.auth.submitting);
    this.asyncValidating$ = this.store.select(state => state.auth.asyncValidating);
  }

  handleSubmit(): void {
    if (this.signupForm.valid) {
      const { name, email, password } = this.signupForm.value;
      this.store.dispatch(AuthActions.signupRequest({ name, email, password }));
    }
  }

  private nameAsyncValidator(control: any): Observable<any> {
    return control.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => this.apiService.isName(value)),
      map(result => (result.data ? { nameInUse: true } : null))
    );
  }

  private emailAsyncValidator(control: any): Observable<any> {
    return control.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => this.apiService.isEmail(value)),
      map(result => (result.data ? { emailInUse: true } : null))
    );
  }
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
  <form [formGroup]="signupForm" (ngSubmit)="handleSubmit()" class="form-horizontal">
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
      class="btn btn-primary form-control"
      [disabled]="signupForm.invalid || (submitting$ | async)"
      type="submit"
    >
      <i class="fa fa-sign-in"></i> Signup
    </button>
  </form>
  <p><a routerLink="/login">Already a member? Log in here.</a></p>
</div>
```

```typescript
// form-group.component.ts
import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-group',
  template: `
    <div [ngClass]="{'has-error': field?.touched && field?.invalid, 'has-success': field?.touched && field?.valid}">
      <ng-content></ng-content>
      <span *ngIf="field?.touched && field?.errors" class="help-block">
        {{ getErrorMessage() }}
      </span>
    </div>
  `,
  styleUrls: ['./form-group.component.css']
})
export class FormGroupComponent {
  @Input() field: AbstractControl | null = null;

  getErrorMessage(): string {
    if (this.field?.errors?.required) {
      return 'This field is required';
    }
    if (this.field?.errors?.minlength) {
      return `Minimum length is ${this.field.errors.minlength.requiredLength}`;
    }
    if (this.field?.errors?.maxlength) {
      return `Maximum length is ${this.field.errors.maxlength.requiredLength}`;
    }
    if (this.field?.errors?.email) {
      return 'A valid email address is required';
    }
    if (this.field?.errors?.nameInUse) {
      return 'This name is already in use';
    }
    if (this.field?.errors?.emailInUse) {
      return 'This email is already in use';
    }
    return '';
  }
}
```

```css
/* form-group.component.css */
.has-error input {
  border-color: #d9534f;
}

.has-success input {
  border-color: #5cb85c;
}

.help-block {
  color: #d9534f;
}
```

```typescript
// api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  isName(name: string): Observable<any> {
    return this.http.get(`/api/validate-name?name=${name}`);
  }

  isEmail(email: string): Observable<any> {
    return this.http.get(`/api/validate-email?email=${email}`);
  }

  signup(name: string, email: string, password: string): Observable<any> {
    return this.http.post('/api/signup', { name, email, password });
  }
}
```

```typescript
// auth.actions.ts
import { createAction, props } from '@ngrx/store';

export const AuthActions = {
  signupRequest: createAction('[Auth] Signup Request', props<{ name: string; email: string; password: string }>()),
  signupSuccess: createAction('[Auth] Signup Success', props<{ user: any }>()),
  signupFailure: createAction('[Auth] Signup Failure', props<{ error: any }>())
};
```

```typescript
// auth.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { AuthActions } from '../actions/auth.actions';

export interface AuthState {
  submitting: boolean;
  asyncValidating: boolean;
  user: any | null;
  error: any | null;
}

const initialState: AuthState = {
  submitting: false,
  asyncValidating: false,
  user: null,
  error: null
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.signupRequest, state => ({ ...state, submitting: true, error: null })),
  on(AuthActions.signupSuccess, (state, { user }) => ({ ...state, submitting: false, user })),
  on(AuthActions.signupFailure, (state, { error }) => ({ ...state, submitting: false, error }))
);
```

### Tokens: {'input_tokens': 1273, 'output_tokens': 1574, 'reasoning_tokens': 0}
### Execution time: 11.722532749176025
