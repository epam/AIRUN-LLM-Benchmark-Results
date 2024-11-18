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
**signup.component.ts**
```typescript
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import { AuthActions } from '../actions/auth.actions';
import { Api } from '../api/api.service';
import { getTitle } from './utils';

@Component({
  selector: 'app-signup',
  template: `
    <div>
      <h2>Join PodBaby today.</h2>
      <hr />
      <p class="lead">
        As a member you can subscribe to podcast feeds and keep track of your favorite episodes.
      </p>
      <form [formGroup]="form" (ngSubmit)="handleSubmit()">
        <app-form-group [field]="form.get('name')">
          <input formControlName="name" type="text" placeholder="Name">
        </app-form-group>

        <app-form-group [field]="form.get('email')">
          <input formControlName="email" type="email" placeholder="Email address">
        </app-form-group>

        <app-form-group [field]="form.get('password')">
          <input formControlName="password" type="password" placeholder="Password">
        </app-form-group>
        <button type="submit" [disabled]="form.invalid || submitting" class="btn btn-primary">
          <i class="fa fa-sign-in"></i> Signup
        </button>
      </form>
      <p><a routerLink="/login">Already a member? Log in here.</a></p>
    </div>
  `,
})
export class SignupComponent implements OnInit {
  form: FormGroup;
  submitting = false;

  constructor(private store: Store, private actions: Actions, private api: Api) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  handleSubmit(): void {
    this.submitting = true;
    this.api.signup(this.form.value.name, this.form.value.email, this.form.value.password)
      .pipe(
        tap((result) => {
          this.store.dispatch(AuthActions.signupComplete({ data: result }));
        }),
        tap(() => {
          this.submitting = false;
        })
      )
      .subscribe();
  }
}
```

**form-group.component.ts**
```typescript
import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-group',
  template: `
    <div [ngClass]="{ 'has-error': field.touched && field.invalid }">
      <ng-content></ng-content>
      <div *ngIf="field.touched && field.invalid" class="help-block">
        {{ field.errors | json }}
      </div>
    </div>
  `,
})
export class FormGroupComponent {
  @Input() field: AbstractControl;
}
```

**auth.actions.ts**
```typescript
import { createAction, props } from '@ngrx/store';

export const signupComplete = createAction(
  '[Auth] Signup Complete',
  props<{ data: any }>()
);
```

**auth.effects.ts**
```typescript
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import { AuthActions } from './auth.actions';

@Injectable()
export class AuthEffects {
  signupComplete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signupComplete),
      tap((action) => {
        // Handle signup complete action
      })
    )
  );

  constructor(private actions$: Actions) {}
}
```

**api.service.ts**
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class Api {
  constructor(private http: HttpClient) {}

  isName(name: string): Observable<any> {
    return this.http.get(`https://example.com/api/is-name/${name}`);
  }

  isEmail(email: string): Observable<any> {
    return this.http.get(`https://example.com/api/is-email/${email}`);
  }

  signup(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`https://example.com/api/signup`, { name, email, password });
  }
}
```

**utils.ts**
```typescript
export function getTitle(title: string): string {
  return `PodBaby - ${title}`;
}
```

### Tokens: {'input_tokens': 1227, 'output_tokens': 986}
### Execution time: 15.843514919281006
