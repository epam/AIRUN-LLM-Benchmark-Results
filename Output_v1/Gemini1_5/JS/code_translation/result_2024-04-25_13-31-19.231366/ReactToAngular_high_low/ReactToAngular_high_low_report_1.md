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

## Run 1:
### Answer:
## signup.component.ts

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { signup } from '../actions/auth.actions';
import { AppState } from '../reducers';
import { isEmailTaken, isNameTaken } from '../services/api.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  nameTaken$: Observable<boolean>;
  emailTaken$: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)], [this.validateName.bind(this)]],
      email: ['', [Validators.required, Validators.email], [this.validateEmail.bind(this)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.nameTaken$ = this.signupForm.get('name').valueChanges.pipe(
      map(name => isNameTaken(name))
    );

    this.emailTaken$ = this.signupForm.get('email').valueChanges.pipe(
      map(email => isEmailTaken(email))
    );
  }

  validateName(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.nameTaken$.pipe(
      map(taken => taken ? { nameTaken: true } : null)
    );
  }

  validateEmail(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.emailTaken$.pipe(
      map(taken => taken ? { emailTaken: true } : null)
    );
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const { name, email, password } = this.signupForm.value;
      this.store.dispatch(signup({ name, email, password }));
    }
  }
}

```

## signup.component.html

```html
<h2>Join PodBaby today.</h2>
<hr />
<p class="lead">
  As a member you can subscribe to podcast feeds and keep track of your favorite episodes.
</p>
<form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="form-horizontal">
  <app-form-group [control]="signupForm.get('name')" label="Name" type="text"></app-form-group>
  <app-form-group [control]="signupForm.get('email')" label="Email address" type="email"></app-form-group>
  <app-form-group [control]="signupForm.get('password')" label="Password" type="password"></app-form-group>
  <button type="submit" class="btn btn-primary form-control" [disabled]="signupForm.invalid">
    <i class="bi bi-box-arrow-in-right"></i> Signup
  </button>
</form>
<p><a routerLink="/login">Already a member? Log in here.</a></p>

```

## form-group.component.ts

```typescript
import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-group',
  templateUrl: './form-group.component.html',
  styleUrls: ['./form-group.component.css']
})
export class FormGroupComponent {
  @Input() control: AbstractControl;
  @Input() label: string;
  @Input() type = 'text';

  get invalid() {
    return this.control.invalid && (this.control.dirty || this.control.touched);
  }

  get errors() {
    return this.control.errors;
  }
}

```

## form-group.component.html

```html
<div class="form-group" [ngClass]="{'has-error': invalid, 'has-success': control.valid && (control.dirty || control.touched)}">
  <label class="control-label">{{label}}</label>
  <input [type]="type" class="form-control" [formControl]="control">
  <div *ngIf="invalid" class="help-block">
    <span *ngIf="errors.required">This field is required</span>
    <span *ngIf="errors.minlength">Must be at least {{errors.minlength.requiredLength}} characters</span>
    <span *ngIf="errors.maxlength">Must be at most {{errors.maxlength.requiredLength}} characters</span>
    <span *ngIf="errors.email">Please enter a valid email address</span>
    <span *ngIf="errors.nameTaken">This name is already taken</span>
    <span *ngIf="errors.emailTaken">This email is already taken</span>
  </div>
</div>

``` 


### Tokens: {'input_tokens': 1428, 'output_tokens': 1212}
### Execution time: 39.90919804573059
