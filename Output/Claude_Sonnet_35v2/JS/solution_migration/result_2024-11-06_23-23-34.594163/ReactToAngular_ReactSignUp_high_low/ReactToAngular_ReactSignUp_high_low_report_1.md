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
signup.component.ts
```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as validator from 'validator';

import { ApiService } from '../services/api.service';
import * as AuthActions from '../store/actions/auth.actions';
import { getTitle } from './utils';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  submitting = false;
  asyncValidating = false;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private api: ApiService,
    private titleService: Title,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.titleService.setTitle(getTitle('Signup'));
    this.setupAsyncValidation();
  }

  private setupAsyncValidation() {
    this.signupForm.get('name')?.valueChanges.subscribe(() => {
      this.validateNameAsync();
    });

    this.signupForm.get('email')?.valueChanges.subscribe(() => {
      this.validateEmailAsync();
    });
  }

  private validateNameAsync() {
    const name = this.signupForm.get('name')?.value;
    if (!name) return;

    this.asyncValidating = true;
    this.api.isName(name).subscribe(result => {
      if (result.data) {
        this.signupForm.get('name')?.setErrors({ nameExists: true });
      }
      this.asyncValidating = false;
    });
  }

  private validateEmailAsync() {
    const email = this.signupForm.get('email')?.value;
    if (!email) return;

    this.asyncValidating = true;
    this.api.isEmail(email).subscribe(result => {
      if (result.data) {
        this.signupForm.get('email')?.setErrors({ emailExists: true });
      }
      this.asyncValidating = false;
    });
  }

  onSubmit() {
    if (this.signupForm.valid && !this.submitting) {
      this.submitting = true;
      const { name, email, password } = this.signupForm.value;

      this.api.signup(name, email, password).subscribe({
        next: (result) => {
          this.store.dispatch(AuthActions.signupComplete({ data: result.data }));
          this.submitting = false;
        },
        error: (error) => {
          this.submitting = false;
        }
      });
    }
  }
}
```

signup.component.html
```html
<div>
  <h2>Join PodBaby today.</h2>
  <hr />
  <p class="lead">
    As a member you can subscribe to podcast feeds and keep track of your favorite episodes.
  </p>
  
  <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="form-horizontal">
    <app-form-group [control]="signupForm.get('name')">
      <input type="text" 
             class="form-control" 
             placeholder="Name" 
             formControlName="name">
    </app-form-group>

    <app-form-group [control]="signupForm.get('email')">
      <input type="email" 
             class="form-control" 
             placeholder="Email address" 
             formControlName="email">
    </app-form-group>

    <app-form-group [control]="signupForm.get('password')">
      <input type="password" 
             class="form-control" 
             placeholder="Password" 
             formControlName="password">
    </app-form-group>

    <button class="btn btn-primary form-control" 
            type="submit" 
            [disabled]="signupForm.invalid || submitting || asyncValidating">
      <i class="fa fa-sign-in"></i> Signup
    </button>
  </form>

  <p><a routerLink="/login">Already a member? Log in here.</a></p>
</div>
```

form-group.component.ts
```typescript
import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-group',
  templateUrl: './form-group.component.html',
  styleUrls: ['./form-group.component.scss']
})
export class FormGroupComponent {
  @Input() control: AbstractControl | null = null;

  get hasError(): boolean {
    return this.control ? this.control.invalid && this.control.touched : false;
  }

  get hasSuccess(): boolean {
    return this.control ? this.control.valid && this.control.touched : false;
  }

  get errorMessage(): string {
    if (!this.control || !this.control.errors) return '';
    
    const errors = this.control.errors;
    
    if (errors['required']) return 'This field is required';
    if (errors['minlength']) return `Minimum length is ${errors['minlength'].requiredLength} characters`;
    if (errors['maxlength']) return `Maximum length is ${errors['maxlength'].requiredLength} characters`;
    if (errors['email']) return 'Please enter a valid email address';
    if (errors['nameExists']) return 'This name is already in use';
    if (errors['emailExists']) return 'This email is already in use';
    
    return 'Invalid input';
  }
}
```

form-group.component.html
```html
<div class="form-group" [ngClass]="{'has-error': hasError, 'has-success': hasSuccess}">
  <ng-content></ng-content>
  <span class="help-block" *ngIf="hasError">
    {{errorMessage}}
  </span>
</div>
```

### Tokens: {'input_tokens': 1575, 'output_tokens': 1671}
### Execution time: 28.08357810974121
