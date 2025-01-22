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
```markdown
# signup.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { signUp } from '../store/auth.actions';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name: [
        '', 
        [Validators.required, Validators.minLength(3), Validators.maxLength(60)],
        [this.nameInUseValidator.bind(this)]
      ],
      email: [
        '', 
        [Validators.required, Validators.email],
        [this.emailInUseValidator.bind(this)]
      ],
      password: [
        '', 
        [Validators.required, Validators.minLength(6)]
      ]
    });
  }

  nameInUseValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value) {
      return of(null);
    }
    return this.api.isName(control.value).pipe(
      map(result => result.data ? { nameInUse: 'This name is already in use' } : null)
    );
  }

  emailInUseValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value) {
      return of(null);
    }
    return this.api.isEmail(control.value).pipe(
      map(result => result.data ? { emailInUse: 'This email is already in use' } : null)
    );
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      const { name, email, password } = this.signupForm.value;
      this.store.dispatch(signUp({ name, email, password }));
    }
  }
}
```

```markdown
# signup.component.html
<div>
  <h2>Join PodBaby today.</h2>
  <hr />
  <p class="lead">
    As a member you can subscribe to podcast feeds and keep track of your favorite episodes.
  </p>
  <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="form-horizontal">
    <app-form-group [control]="signupForm.get('name')">
      <input type="text" class="form-control" placeholder="Name" formControlName="name" />
    </app-form-group>

    <app-form-group [control]="signupForm.get('email')">
      <input type="email" class="form-control" placeholder="Email address" formControlName="email" />
    </app-form-group>

    <app-form-group [control]="signupForm.get('password')">
      <input type="password" class="form-control" placeholder="Password" formControlName="password" />
    </app-form-group>

    <button
      type="submit"
      class="form-control btn btn-primary"
      [disabled]="signupForm.invalid || signupForm.pending"
    >
      <i class="fa fa-sign-in"></i> Signup
    </button>
  </form>
  <p>
    <a routerLink="/login">Already a member? Log in here.</a>
  </p>
</div>
```

```markdown
# form-group.component.ts
import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-group',
  template: `
    <div class="form-group" [ngClass]="{'has-error': control?.touched && control?.errors, 'has-success': control?.touched && !control?.errors}">
      <ng-content></ng-content>
      <span class="help-block" *ngIf="control?.touched && control?.errors">
        {{ getErrorMessage() }}
      </span>
    </div>
  `
})
export class FormGroupComponent {
  @Input() control!: AbstractControl | null;

  getErrorMessage(): string {
    if (!this.control || !this.control.errors) {
      return '';
    }
    const errors = this.control.errors;
    if (errors['nameInUse']) {
      return errors['nameInUse'];
    }
    if (errors['emailInUse']) {
      return errors['emailInUse'];
    }
    if (errors['required']) {
      return 'This field is required';
    }
    if (errors['minlength']) {
      return `Minimum length is ${errors['minlength'].requiredLength}`;
    }
    if (errors['maxlength']) {
      return `Maximum length is ${errors['maxlength'].requiredLength}`;
    }
    if (errors['email']) {
      return 'A valid email address is required';
    }
    return '';
  }
}
```

```markdown
# auth.actions.ts
import { createAction, props } from '@ngrx/store';

export const signUp = createAction(
  '[Auth] Sign Up',
  props<{ name: string; email: string; password: string }>()
);

export const signUpSuccess = createAction(
  '[Auth] Sign Up Success',
  props<{ user: any }>()
);

export const signUpFailure = createAction(
  '[Auth] Sign Up Failure',
  props<{ error: any }>()
);
```

```markdown
# auth.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ApiService } from '../api.service';
import { signUp, signUpSuccess, signUpFailure } from './auth.actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class AuthEffects {
  signUp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signUp),
      mergeMap((action) =>
        this.api.signup(action.name, action.email, action.password).pipe(
          map((result) => signUpSuccess({ user: result.data })),
          catchError((error) => of(signUpFailure({ error: error.data })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private api: ApiService) {}
}
```

```markdown
# auth.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { signUp, signUpSuccess, signUpFailure } from './auth.actions';

export interface AuthState {
  user: any;
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
  on(signUp, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(signUpSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null
  })),
  on(signUpFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
```

```markdown
# api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  signup(name: string, email: string, password: string): Observable<any> {
    return this.http.post('/api/signup', { name, email, password });
  }

  isName(name: string): Observable<any> {
    return this.http.get(`/api/is-name?name=${encodeURIComponent(name)}`);
  }

  isEmail(email: string): Observable<any> {
    return this.http.get(`/api/is-email?email=${encodeURIComponent(email)}`);
  }
}
```

### Tokens: {'input_tokens': 1272, 'output_tokens': 4149, 'reasoning_tokens': 2432}
### Execution time: 33.51964020729065
