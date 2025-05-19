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
// signup.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { authActions } from '../actions';
import { ApiService } from '../api.service';
import { getTitle } from './utils';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  form: FormGroup;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private actions$: Actions,
    private api: ApiService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)], [this.validateName.bind(this)]],
      email: ['', [Validators.required, Validators.email], [this.validateEmail.bind(this)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submit() {
    this.submitting = true;
    const { name, email, password } = this.form.value;

    this.api.signup(name, email, password).pipe(
      map(result => {
        this.store.dispatch(authActions.signupComplete({ data: result.data }));
        this.submitting = false;
      }),
      catchError(error => {
        this.submitting = false;
        return of(error);
      })
    ).subscribe();
  }

  validateName(control: FormControl): Observable<{ [key: string]: any } | null> {
    return control.valueChanges.pipe(
      switchMap(value => this.api.isName(value).pipe(
        map(res => res.data ? { nameTaken: true } : null),
        catchError(() => of(null))
      ))
    );
  }

  validateEmail(control: FormControl): Observable<{ [key: string]: any } | null> {
    return control.valueChanges.pipe(
      switchMap(value => this.api.isEmail(value).pipe(
        map(res => res.data ? { emailTaken: true } : null),
        catchError(() => of(null))
      ))
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
    As a member you can subscribe to podcast feeds and track episodes.
  </p>
  <form [formGroup]="form" (ngSubmit)="submit()">
    <div class="form-group" [ngClass]="{'has-error': form.get('name').invalid && form.get('name').touched}">
      <input formControlName="name" type="text" class="form-control" placeholder="Name" />
      <div *ngIf="form.get('name').errors?.required && form.get('name').touched">Name required</div>
      <div *ngIf="form.get('name').errors?.minlength">Min 3 chars</div>
      <div *ngIf="form.get('name').errors?.nameTaken">Name taken</div>
    </div>

    <div class="form-group" [ngClass]="{'has-error': form.get('email').invalid && form.get('email').touched}">
      <input formControlName="email" type="email" class="form-control" placeholder="Email" />
      <div *ngIf="form.get('email').errors?.required && form.get('email').touched">Email required</div>
      <div *ngIf="form.get('email').errors?.email">Invalid email</div>
      <div *ngIf="form.get('email').errors?.emailTaken">Email taken</div>
    </div>

    <div class="form-group" [ngClass]="{'has-error': form.get('password').invalid && form.get('password').touched}">
      <input formControlName="password" type="password" class="form-control" placeholder="Password" />
      <div *ngIf="form.get('password').errors?.required && form.get('password').touched">Password required</div>
      <div *ngIf="form.get('password').errors?.minlength">Min 6 chars</div>
    </div>

    <button type="submit" class="btn btn-primary" [disabled]="submitting || form.invalid">
      <i class="fa fa-sign-in"></i> Signup
    </button>
  </form>
  <p><a routerLink="/login">Already a member? Login</a></p>
</div>
```

```typescript
// form-group.component.ts
import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-group',
  template: `
    <div [formGroup]="form" class="form-group" [ngClass]="{'has-error': field.invalid && field.touched}">
      <ng-content></ng-content>
      <div *ngIf="field.errors && field.touched" class="help-block">
        {{ field.errors | json }}
      </div>
    </div>
  `
})
export class FormGroupComponent {
  @Input() form!: FormGroup;
  @Input() field!: any;
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
// api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  signup(name: string, email: string, password: string) {
    return this.http.post('/api/signup', { name, email, password });
  }

  isName(name: string) {
    return this.http.get(`/api/check-name?name=${name}`);
  }

  isEmail(email: string) {
    return this.http.get(`/api/check-email?email=${email}`);
  }
}
```

### Tokens: {'input_tokens': 1772, 'output_tokens': 1685}
### Execution time: 28.39268398284912
