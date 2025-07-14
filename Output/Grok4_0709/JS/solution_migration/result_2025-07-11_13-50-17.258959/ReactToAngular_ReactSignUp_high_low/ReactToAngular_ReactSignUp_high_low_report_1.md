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
// validators.ts
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import validator from 'validator';
import { AuthService } from '../services/auth.service';

export function nameValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value || '';
  if (value.length < 3 || value.length > 60) {
    return { error: 'Name must be between 3 and 60 characters in length' };
  }
  return null;
}

export function emailValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value || '';
  if (!value || !validator.isEmail(value)) {
    return { error: 'A valid email address is required' };
  }
  return null;
}

export function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value || '';
  if (!value || value.length < 6) {
    return { error: 'Password must be at least 6 characters' };
  }
  return null;
}

export function nameAvailabilityValidator(authService: AuthService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const value = control.value;
    if (!value) {
      return of(null);
    }
    return authService.isName(value).pipe(
      map((result: boolean) => result ? { error: 'This name is already in use' } : null),
      catchError(() => of(null))
    );
  };
}

export function emailAvailabilityValidator(authService: AuthService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const value = control.value;
    if (!value) {
      return of(null);
    }
    return authService.isEmail(value).pipe(
      map((result: boolean) => result ? { error: 'This email is already in use' } : null),
      catchError(() => of(null))
    );
  };
}
```

```typescript
// form-group.component.ts
import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-group',
  template: `
    <div class="form-group"
         [ngClass]="{
           'has-feedback': control.touched,
           'has-success': control.touched && control.valid,
           'has-error': control.touched && control.invalid
         }">
      <ng-content></ng-content>
      <span class="glyphicon glyphicon-ok form-control-feedback" *ngIf="control.touched && control.valid"></span>
      <span class="glyphicon glyphicon-remove form-control-feedback" *ngIf="control.touched && control.invalid"></span>
      <span class="help-block" *ngIf="control.touched && control.invalid">
        {{ control.errors?.error || control.errors?.server }}
      </span>
    </div>
  `
})
export class FormGroupComponent {
  @Input() control!: AbstractControl;
}
```

```typescript
// signup.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import { signupComplete } from '../actions/auth.actions';
import { AuthService } from '../services/auth.service';
import { getTitle } from './utils';
import {
  nameValidator,
  emailValidator,
  passwordValidator,
  nameAvailabilityValidator,
  emailAvailabilityValidator
} from './validators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit {
  form!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private store: Store,
    private title: Title
  ) {}

  ngOnInit(): void {
    this.title.setTitle(getTitle('Signup'));
    this.form = this.fb.group({
      name: this.fb.control('', {
        validators: [nameValidator],
        asyncValidators: [nameAvailabilityValidator(this.authService)],
        updateOn: 'blur'
      }),
      email: this.fb.control('', {
        validators: [emailValidator],
        asyncValidators: [emailAvailabilityValidator(this.authService)],
        updateOn: 'blur'
      }),
      password: this.fb.control('', [passwordValidator])
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.isSubmitting = true;
    const values = this.form.value;
    this.authService.signup(values.name, values.email, values.password).subscribe({
      next: (result) => {
        this.store.dispatch(signupComplete(result));
        this.isSubmitting = false;
      },
      error: (error) => {
        this.isSubmitting = false;
        const errors = error.data || {};
        Object.keys(errors).forEach(key => {
          const control = this.form.get(key);
          if (control) {
            control.setErrors({ server: errors[key] });
            control.markAsTouched();
          }
        });
      }
    });
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
  <form class="form-horizontal" [formGroup]="form" (ngSubmit)="onSubmit()">
    <app-form-group [control]="form.get('name')!">
      <input type="text" class="form-control" placeholder="Name" formControlName="name" />
    </app-form-group>
    <app-form-group [control]="form.get('email')!">
      <input type="email" class="form-control" placeholder="Email address" formControlName="email" />
    </app-form-group>
    <app-form-group [control]="form.get('password')!">
      <input type="password" class="form-control" placeholder="Password" formControlName="password" />
    </app-form-group>
    <button
      type="submit"
      class="btn btn-primary form-control"
      [disabled]="form.invalid || form.pending || isSubmitting"
    >
      <app-icon icon="sign-in"></app-icon> Signup
    </button>
  </form>
  <p><a routerLink="/login">Already a member? Log in here.</a></p>
</div>
```

### Tokens: {'input_tokens': 1479, 'output_tokens': 1391, 'reasoning_tokens': 8958}
### Execution time: 290.4754021167755
