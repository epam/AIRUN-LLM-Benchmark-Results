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
```markdown
signup.component.ts
```typescript
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import validator from 'validator';
import { AppState } from '../store/app.state';
import { signupComplete } from '../store/auth/auth.actions';
import { AuthSelectors } from '../store/auth/auth.selectors';
import { ApiService } from '../api.service';
import { FormGroupComponent } from '../components/form-group/form-group.component';
import { IconComponent } from '../components/icon/icon.component';

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
    private router: Router,
    private store: Store<AppState>,
    private apiService: ApiService
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
      email: ['', [Validators.required, this.emailValidator]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.submitting$ = this.store.select(AuthSelectors.selectSubmitting);
  }

  emailValidator(control) {
    if (!control.value || !validator.isEmail(control.value)) {
      return { invalidEmail: true };
    }
    return null;
  }

  asyncValidate(control) {
    const field = control.name;
    const value = control.value;

    if (!value) return;

    return this.apiService[`is${field.charAt(0).toUpperCase() + field.slice(1)}`](value).pipe(
      map(result => {
        if (result.data) {
          return { [field]: `${field.charAt(0).toUpperCase() + field.slice(1)} is already in use` };
        }
        return null;
      })
    );
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const { name, email, password } = this.signupForm.value;
      this.store.dispatch(signupComplete({ name, email, password }));
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
    <app-form-group [field]="signupForm.get('name')">
      <input formControlName="name" type="text" class="form-control" placeholder="Name" />
    </app-form-group>

    <app-form-group [field]="signupForm.get('email')">
      <input formControlName="email" type="email" class="form-control" placeholder="Email address" />
    </app-form-group>

    <app-form-group [field]="signupForm.get('password')">
      <input formControlName="password" type="password" class="form-control" placeholder="Password" />
    </app-form-group>
    <button
      type="submit"
      class="btn btn-primary form-control"
      [disabled]="signupForm.invalid || submitting$ | async"
    >
      <app-icon icon="sign-in"></app-icon> Signup
    </button>
  </form>
  <p><a routerLink="/login/">Already a member? Log in here.</a></p>
</div>
```

signup.component.css
```css
/* Add your styles here */
```

form-group.component.ts
```typescript
import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-form-group',
  templateUrl: './form-group.component.html',
  styleUrls: ['./form-group.component.css']
})
export class FormGroupComponent {
  @Input() field: AbstractControl;
}
```

form-group.component.html
```html
<div [ngClass]="{'has-feedback': field.touched, 'has-error': field.touched && field.errors, 'has-success': field.touched && !field.errors}">
  <ng-content></ng-content>
  <span *ngIf="field.touched && field.errors" class="help-block">
    <span *ngIf="field.errors['required']">This field is required</span>
    <span *ngIf="field.errors['minlength']">This field must be at least {{field.errors['minlength'].requiredLength}} characters long</span>
    <span *ngIf="field.errors['maxlength']">This field must be no more than {{field.errors['maxlength'].requiredLength}} characters long</span>
    <span *ngIf="field.errors['invalidEmail']">A valid email address is required</span>
    <span *ngIf="field.errors['name']">{{field.errors['name']}}</span>
    <span *ngIf="field.errors['email']">{{field.errors['email']}}</span>
  </span>
</div>
```

form-group.component.css
```css
/* Add your styles here */
```

icon.component.ts
```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.css']
})
export class IconComponent {
  @Input() icon: string;
}
```

icon.component.html
```html
<i [class]="icon"></i>
```

icon.component.css
```css
/* Add your styles here */
```
```

### Tokens: {'input_tokens': 1230, 'output_tokens': 1220}
### Execution time: 13.716891050338745
