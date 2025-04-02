I have the following React app code:

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
**form-group.component.ts**
```typescript
import { Component, Input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-form-group',
  templateUrl: './form-group.component.html'
})
export class FormGroupComponent {
  @Input() field: AbstractControl;

  get errorMessage(): string | null {
    if (this.field && this.field.errors) {
      for (const errorName in this.field.errors) {
        if (this.field.errors.hasOwnProperty(errorName)) {
          return this.getValidatorErrorMessage(errorName, this.field.errors[errorName]);
        }
      }
    }
    return null;
  }

  getValidatorErrorMessage(validatorName: string, validatorValue?: any): string {
    const config: { [key: string]: string } = {
      required: 'This field is required',
      minlength: `Minimum length ${validatorValue.requiredLength}`,
      maxlength: `Maximum length ${validatorValue.requiredLength}`,
      email: 'A valid email address is required',
      nameTaken: 'This name is already in use',
      emailTaken: 'This email is already in use',
      passwordStrength: 'Password must be at least 6 characters',
    };
    return config[validatorName] || 'Invalid field';
  }
}
```

**form-group.component.html**
```html
<div [ngClass]="{
  'form-group': true,
  'has-error': field.touched && field.invalid,
  'has-success': field.touched && field.valid
}">
  <ng-content></ng-content>
  <span *ngIf="field.touched && errorMessage" class="help-block">
    {{ errorMessage }}
  </span>
</div>
```

**signup.component.ts**
```typescript
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { ApiService } from '../api.service';
import { AuthActions } from '../actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent {
  signupForm: FormGroup;
  submitting: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private authActions: AuthActions,
    private store: Store<any>,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)], [this.nameAsyncValidator()]],
      email: ['', [Validators.required, Validators.email], [this.emailAsyncValidator()]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  nameAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return new Observable<ValidationErrors | null>(observer => observer.next(null));
      } else {
        return timer(500).pipe(
          switchMap(() =>
            this.api.isName(control.value).pipe(
              map(result => (result.data ? { nameTaken: true } : null))
            )
          )
        );
      }
    };
  }

  emailAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return new Observable<ValidationErrors | null>(observer => observer.next(null));
      } else {
        return timer(500).pipe(
          switchMap(() =>
            this.api.isEmail(control.value).pipe(
              map(result => (result.data ? { emailTaken: true } : null))
            )
          )
        );
      }
    };
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.submitting = true;
      this.errorMessage = null;
      const { name, email, password } = this.signupForm.value;
      this.api.signup(name, email, password).subscribe(
        result => {
          this.store.dispatch(this.authActions.signupComplete(result.data));
          this.router.navigate(['/']);
          this.submitting = false;
        },
        error => {
          this.errorMessage = error.error.message || 'An error occurred during signup';
          this.submitting = false;
        }
      );
    }
  }
}
```

**signup.component.html**
```html
<div>
  <h2>Join PodBaby today.</h2>
  <hr />
  <p class="lead">
    As a member you can subscribe to podcast feeds and keep track of your favorite episodes.
  </p>
  <div *ngIf="errorMessage" class="alert alert-danger">
    {{ errorMessage }}
  </div>
  <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="form-horizontal">
    <app-form-group [field]="signupForm.controls.name">
      <input type="text" class="form-control" placeholder="Name" formControlName="name">
    </app-form-group>
    <app-form-group [field]="signupForm.controls.email">
      <input type="email" class="form-control" placeholder="Email address" formControlName="email">
    </app-form-group>
    <app-form-group [field]="signupForm.controls.password">
      <input type="password" class="form-control" placeholder="Password" formControlName="password">
    </app-form-group>
    <button class="form-control btn btn-primary" [disabled]="submitting" type="submit">
      <i class="fa fa-sign-in"></i> Signup
    </button>
  </form>
  <p><a routerLink="/login">Already a member? Log in here.</a></p>
</div>
```

### Tokens: {'input_tokens': 1306, 'output_tokens': 7480, 'reasoning_tokens': 6208}
### Execution time: 83.15473508834839
