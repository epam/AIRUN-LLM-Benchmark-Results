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
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import * as fromAuth from '../store/auth.actions';
import * as fromApi from '../api';
import { getTitle } from './utils';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  submitting$: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.submitting$ = this.store.select(state => state.auth.submitting);
  }

  handleSubmit() {
    if (this.signupForm.valid) {
      const { name, email, password } = this.signupForm.value;
      this.store.dispatch(fromAuth.signup({ name, email, password }));
    }
  }

  asyncValidate(field: string) {
    const value = this.signupForm.get(field)?.value;
    if (field === 'name') {
      return fromApi.isName(value).pipe(
        map(result => result.data ? { nameTaken: true } : null)
      );
    } else if (field === 'email') {
      return fromApi.isEmail(value).pipe(
        map(result => result.data ? { emailTaken: true } : null)
      );
    }
    return null;
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
  <form [formGroup]="signupForm" (ngSubmit)="handleSubmit()">
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
  templateUrl: './form-group.component.html',
  styleUrls: ['./form-group.component.css']
})
export class FormGroupComponent {
  @Input() field: AbstractControl | null = null;
}
```

```html
<!-- form-group.component.html -->
<div class="form-group" [ngClass]="{'has-error': field?.touched && field?.invalid, 'has-success': field?.touched && field?.valid}">
  <ng-content></ng-content>
  <div *ngIf="field?.touched && field?.invalid" class="help-block">
    <span *ngIf="field?.errors?.required">This field is required</span>
    <span *ngIf="field?.errors?.minlength">Minimum length is {{ field?.errors?.minlength.requiredLength }}</span>
    <span *ngIf="field?.errors?.maxlength">Maximum length is {{ field?.errors?.maxlength.requiredLength }}</span>
    <span *ngIf="field?.errors?.email">A valid email address is required</span>
    <span *ngIf="field?.errors?.nameTaken">This name is already in use</span>
    <span *ngIf="field?.errors?.emailTaken">This email is already in use</span>
  </div>
</div>
```

```typescript
// auth.actions.ts
import { createAction, props } from '@ngrx/store';

export const signup = createAction(
  '[Auth] Signup',
  props<{ name: string; email: string; password: string }>()
);

export const signupComplete = createAction(
  '[Auth] Signup Complete',
  props<{ user: any }>()
);
```

```typescript
// auth.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as AuthActions from './auth.actions';
import * as fromApi from '../api';

@Injectable()
export class AuthEffects {
  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signup),
      mergeMap(action =>
        fromApi.signup(action.name, action.email, action.password).pipe(
          map(user => AuthActions.signupComplete({ user })),
          catchError(error => of(AuthActions.signupFailed({ error })))
        )
      )
    )
  );

  constructor(private actions$: Actions) {}
}
```

```typescript
// api.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  signup(name: string, email: string, password: string): Observable<any> {
    return this.http.post('/api/signup', { name, email, password });
  }

  isName(name: string): Observable<any> {
    return this.http.get(`/api/check-name?name=${name}`);
  }

  isEmail(email: string): Observable<any> {
    return this.http.get(`/api/check-email?email=${email}`);
  }
}
```

### Tokens: {'input_tokens': 1273, 'output_tokens': 1396}
### Execution time: 15.92461085319519
