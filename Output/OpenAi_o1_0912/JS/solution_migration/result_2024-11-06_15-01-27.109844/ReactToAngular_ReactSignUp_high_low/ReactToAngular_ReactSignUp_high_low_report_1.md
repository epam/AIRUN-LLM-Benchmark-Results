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
### app-form-group.component.ts
```typescript
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-group',
  templateUrl: './app-form-group.component.html'
})
export class FormGroupComponent {
  @Input() field: FormControl;

  getErrorMessage() {
    const errors = this.field.errors;
    if (errors) {
      if (errors.required) {
        return 'This field is required';
      } else if (errors.minlength) {
        return `Minimum length is ${errors.minlength.requiredLength}`;
      } else if (errors.maxlength) {
        return `Maximum length is ${errors.maxlength.requiredLength}`;
      } else if (errors.email) {
        return 'A valid email address is required';
      } else if (errors.nameExists) {
        return errors.nameExists;
      } else if (errors.emailExists) {
        return errors.emailExists;
      }
    }
    return null;
  }
}
```

### app-form-group.component.html
```html
<div class="form-group" 
     [class.has-error]="field.touched && field.invalid" 
     [class.has-success]="field.touched && field.valid">
  <ng-content></ng-content>
  <span *ngIf="field.touched && field.invalid" class="help-block">
    {{ getErrorMessage() }}
  </span>
</div>
```

### signup.component.ts
```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AsyncValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { api } from '../api';
import { authActions } from '../actions';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private store: Store<any>,
    private apiService: api
  ) { }

  ngOnInit() {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)], [this.nameExistsValidator()]],
      email: ['', [Validators.required, Validators.email], [this.emailExistsValidator()]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  nameExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      return timer(500).pipe(
        switchMap(() => this.apiService.isName(control.value).pipe(
          map(result => {
            return result.data ? { nameExists: 'This name is already in use' } : null;
          })
        ))
      );
    };
  }

  emailExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      return timer(500).pipe(
        switchMap(() => this.apiService.isEmail(control.value).pipe(
          map(result => {
            return result.data ? { emailExists: 'This email is already in use' } : null;
          })
        ))
      );
    };
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      return;
    }

    this.submitting = true;
    const { name, email, password } = this.signupForm.value;
    this.apiService.signup(name, email, password).subscribe(
      result => {
        this.store.dispatch(authActions.signupComplete({ data: result.data }));
        this.submitting = false;
      },
      error => {
        this.submitting = false;
      }
    );
  }
}
```

### signup.component.html
```html
<div>
  <h2>Join PodBaby today.</h2>
  <hr />
  <p class="lead">
    As a member you can subscribe to podcast feeds and keep track of your favorite episodes.
  </p>
  <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="form-horizontal">
    
    <app-form-group [field]="signupForm.get('name')">
      <input type="text"
             class="form-control"
             placeholder="Name"
             formControlName="name" />
    </app-form-group>

    <app-form-group [field]="signupForm.get('email')">
      <input type="email"
             class="form-control"
             placeholder="Email address"
             formControlName="email" />
    </app-form-group>

    <app-form-group [field]="signupForm.get('password')">
      <input type="password"
             class="form-control"
             placeholder="Password"
             formControlName="password" />
    </app-form-group>

    <button
      type="submit"
      class="btn btn-primary form-control"
      [disabled]="submitting || signupForm.invalid">
      Signup
    </button>
  </form>
  <p><a routerLink="/login/">Already a member? Log in here.</a></p>
</div>
```

### Tokens: {'input_tokens': 1306, 'output_tokens': 6774, 'reasoning_tokens': 5632}
### Execution time: 71.02434587478638
