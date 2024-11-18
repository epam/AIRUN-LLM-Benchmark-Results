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


Your task is to migrate this code to Angular 14.x.
When performing the translation, ensure to adhere to the instructions below:
- Use common libraries: @ngrx/store and @ngrx/effects.
- Split the code into separate components.
- Optimize the code where possible.
- The converted code should not contain any TODOs.
- Return the translated code as markdown code snippets.
- Simply return the codebase without additional comments or explanations on how to convert it.

## Run 3:
### Answer:
```typescript
// signup.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as AuthActions from '../actions/auth.actions';
import * as fromAuth from '../reducers';
import { ApiService } from '../services/api.service';
import { emailValidator, nameValidator, passwordValidator } from '../validators/custom.validators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  submitting$: Observable<boolean>;

  constructor(private fb: FormBuilder, private store: Store<fromAuth.State>, private apiService: ApiService) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, nameValidator]],
      email: ['', [Validators.required, emailValidator]],
      password: ['', [Validators.required, passwordValidator]]
    });

    this.submitting$ = this.store.select(fromAuth.getSubmitting);

    this.signupForm.controls['name'].valueChanges.pipe(
      map(name => {
        if (name && name.length > 0) {
          this.apiService.isName(name).subscribe(result => {
            if (result.data) {
              this.signupForm.controls['name'].setErrors({ 'nameInUse': true });
            }
          });
        }
      })
    ).subscribe();

    this.signupForm.controls['email'].valueChanges.pipe(
      map(email => {
        if (email && email.length > 0) {
          this.apiService.isEmail(email).subscribe(result => {
            if (result.data) {
              this.signupForm.controls['email'].setErrors({ 'emailInUse': true });
            }
          });
        }
      })
    ).subscribe();
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const { name, email, password } = this.signupForm.value;
      this.store.dispatch(new AuthActions.Signup({ name, email, password }));
    }
  }
}
```

```html
<!-- signup.component.html -->
<div class="container">
  <h2>Join PodBaby today.</h2>
  <hr />
  <p class="lead">
    As a member you can subscribe to podcast feeds and keep track of your favorite episodes.
  </p>
  <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
    <app-form-group [field]="signupForm.controls['name']" placeholder="Name" type="text"></app-form-group>
    <app-form-group [field]="signupForm.controls['email']" placeholder="Email address" type="email"></app-form-group>
    <app-form-group [field]="signupForm.controls['password']" placeholder="Password" type="password"></app-form-group>
    <button class="btn btn-primary" [disabled]="submitting$ | async" type="submit">Signup</button>
  </form>
  <p><a routerLink="/login/">Already a member? Log in here.</a></p>
</div>
```

```typescript
// form-group.component.ts
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-group',
  templateUrl: './form-group.component.html',
  styleUrls: ['./form-group.component.css']
})
export class FormGroupComponent {
  @Input() field: FormControl;
  @Input() placeholder: string;
  @Input() type: string = 'text';

  get isValid() { return this.field.touched && !this.field.errors; }
  get isInvalid() { return this.field.touched && this.field.errors; }
}
```

```html
<!-- form-group.component.html -->
<div class="form-group" [ngClass]="{'has-error': isInvalid, 'has-success': isValid}">
  <input [type]="type" class="form-control" [placeholder]="placeholder" [formControl]="field">
  <span *ngIf="isInvalid" class="help-block">
    <span *ngIf="field.errors?.required">This field is required.</span>
    <span *ngIf="field.errors?.email">A valid email address is required.</span>
    <span *ngIf="field.errors?.nameInUse">This name is already in use.</span>
    <span *ngIf="field.errors?.emailInUse">This email is already in use.</span>
    <span *ngIf="field.errors?.nameValidator">Name must be between 3 and 60 characters in length.</span>
    <span *ngIf="field.errors?.emailValidator">A valid email address is required.</span>
    <span *ngIf="field.errors?.passwordValidator">Password must be at least 6 characters.</span>
  </span>
</div>
```

```typescript
// custom.validators.ts
import { AbstractControl } from '@angular/forms';

export function nameValidator(control: AbstractControl): { [key: string]: any } | null {
  const valid = control.value && control.value.length >= 3 && control.value.length <= 60;
  return valid ? null : { 'nameValidator': true };
}

export function emailValidator(control: AbstractControl): { [key: string]: any } | null {
  const valid = control.value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(control.value);
  return valid ? null : { 'emailValidator': true };
}

export function passwordValidator(control: AbstractControl): { [key: string]: any } | null {
  const valid = control.value && control.value.length >= 6;
  return valid ? null : { 'passwordValidator': true };
}
```
### Tokens: {'prompt_tokens': 1196, 'completion_tokens': 1202, 'total_tokens': 2398}
### Execution time: 87.9267840385437
