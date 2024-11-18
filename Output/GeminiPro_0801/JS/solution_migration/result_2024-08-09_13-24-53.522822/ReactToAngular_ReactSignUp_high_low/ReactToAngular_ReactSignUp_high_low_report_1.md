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
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { signupComplete } from '../actions';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private store: Store,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    }, {
      asyncValidators: this.nameAndEmailValidator.bind(this)
    });
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      return;
    }

    const { name, email, password } = this.signupForm.value;

    this.apiService.signup(name, email, password).subscribe({
      next: (user) => {
        this.store.dispatch(signupComplete({ user }));
        this.router.navigate(['/']);
      },
      error: (error) => {
        // Handle error, e.g., display error message
        console.error('Signup failed:', error);
      }
    });
  }

  private nameAndEmailValidator(formGroup: FormGroup) {
    const { name, email } = formGroup.value;

    return Promise.all([
      this.apiService.isName(name).toPromise(),
      this.apiService.isEmail(email).toPromise()
    ]).then(([isNameTaken, isEmailTaken]) => {
      const errors = {};
      if (isNameTaken) {
        errors['name'] = 'This name is already in use';
      }
      if (isEmailTaken) {
        errors['email'] = 'This email is already in use';
      }
      return Object.keys(errors).length ? errors : null;
    });
  }
}

```

```html
<h2>Join PodBaby today.</h2>
<hr />
<p class="lead">
  As a member you can subscribe to podcast feeds and keep track of your favorite episodes.
</p>
<form class="form-horizontal" [formGroup]="signupForm" (ngSubmit)="onSubmit()">
  <div class="form-group">
    <label for="name" class="control-label">Name:</label>
    <input type="text" id="name" class="form-control" formControlName="name" placeholder="Name"
      [ngClass]="{ 'is-invalid': signupForm.get('name').invalid && (signupForm.get('name').dirty || signupForm.get('name').touched) }">
    <div *ngIf="signupForm.get('name').invalid && (signupForm.get('name').dirty || signupForm.get('name').touched)" class="invalid-feedback">
      <div *ngIf="signupForm.get('name').errors['required']">Name is required.</div>
      <div *ngIf="signupForm.get('name').errors['minlength']">Name must be at least 3 characters long.</div>
      <div *ngIf="signupForm.get('name').errors['maxlength']">Name cannot exceed 60 characters.</div>
      <div *ngIf="signupForm.get('name').errors['name']">{{ signupForm.get('name').errors['name'] }}</div>
    </div>
  </div>

  <div class="form-group">
    <label for="email" class="control-label">Email address:</label>
    <input type="email" id="email" class="form-control" formControlName="email" placeholder="Email address"
      [ngClass]="{ 'is-invalid': signupForm.get('email').invalid && (signupForm.get('email').dirty || signupForm.get('email').touched) }">
    <div *ngIf="signupForm.get('email').invalid && (signupForm.get('email').dirty || signupForm.get('email').touched)" class="invalid-feedback">
      <div *ngIf="signupForm.get('email').errors['required']">Email is required.</div>
      <div *ngIf="signupForm.get('email').errors['email']">Please enter a valid email address.</div>
      <div *ngIf="signupForm.get('email').errors['email']">{{ signupForm.get('email').errors['email'] }}</div>
    </div>
  </div>

  <div class="form-group">
    <label for="password" class="control-label">Password:</label>
    <input type="password" id="password" class="form-control" formControlName="password" placeholder="Password"
      [ngClass]="{ 'is-invalid': signupForm.get('password').invalid && (signupForm.get('password').dirty || signupForm.get('password').touched) }">
    <div *ngIf="signupForm.get('password').invalid && (signupForm.get('password').dirty || signupForm.get('password').touched)" class="invalid-feedback">
      <div *ngIf="signupForm.get('password').errors['required']">Password is required.</div>
      <div *ngIf="signupForm.get('password').errors['minlength']">Password must be at least 6 characters long.</div>
    </div>
  </div>

  <button type="submit" class="btn btn-primary" [disabled]="signupForm.invalid">Signup</button>
</form>
<p><a routerLink="/login">Already a member? Log in here.</a></p>

```

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  isName(name: string): Observable<any> {
    return this.http.post('/api/is_name/', { name });
  }

  isEmail(email: string): Observable<any> {
    return this.http.post('/api/is_email/', { email });
  }

  signup(name: string, email: string, password: string): Observable<any> {
    return this.http.post('/api/signup/', { name, email, password });
  }
}

```

### Tokens: {'input_tokens': 1455, 'output_tokens': 1572}
### Execution time: 31.199045181274414
