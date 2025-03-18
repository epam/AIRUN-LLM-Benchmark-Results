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

## Run 2:
### Answer:
```markdown
## Angular Components and Services

### signup.component.ts
```typescript
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { AuthActions } from '../store/actions/auth.actions';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private store: Store,
    private authActions: AuthActions
  ) {
    this.createForm();
  }

  createForm() {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)], this.validateNameNotTaken.bind(this)],
      email: ['', [Validators.required, Validators.email], this.validateEmailNotTaken.bind(this)],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  validateNameNotTaken(control: AbstractControl) {
    return this.apiService.isNameTaken(control.value).pipe(
      debounceTime(300),
      map(res => {
        return res ? { nameTaken: true } : null;
      })
    );
  }

  validateEmailNotTaken(control: AbstractControl) {
    return this.apiService.isEmailTaken(control.value).pipe(
      debounceTime(300),
      map(res => {
        return res ? { emailTaken: true } : null;
      })
    );
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.submitting = true;
      const { name, email, password } = this.signupForm.value;
      this.apiService.signup(name, email, password).subscribe(
        data => {
          this.store.dispatch(this.authActions.signupComplete(data));
          this.submitting = false;
        },
        error => {
          this.submitting = false;
          console.error('Signup failed', error);
        }
      );
    }
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
  <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
    <app-form-group [field]="signupForm.controls.name">
      <input type="text" class="form-control" placeholder="Name" formControlName="name">
    </app-form-group>

    <app-form-group [field]="signupForm.controls.email">
      <input type="email" class="form-control" placeholder="Email address" formControlName="email">
    </app-form-group>

    <app-form-group [field]="signupForm.controls.password">
      <input type="password" class="form-control" placeholder="Password" formControlName="password">
    </app-form-group>
    <button type="submit" class="btn btn-primary" [disabled]="submitting">Signup</button>
  </form>
  <p><a routerLink="/login">Already a member? Log in here.</a></p>
</div>
```

### form-group.component.ts
```typescript
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-group',
  templateUrl: './form-group.component.html',
  styleUrls: ['./form-group.component.css']
})
export class FormGroupComponent {
  @Input() field: FormControl;

  get isValid() { return this.field.touched && !this.field.errors; }
  get isInvalid() { return this.field.touched && this.field.errors; }
}
```

### form-group.component.html
```html
<div [ngClass]="{'has-error': isInvalid, 'has-success': isValid}">
  <ng-content></ng-content>
  <span *ngIf="isInvalid" class="help-block">
    {{ field.errors | json }}
  </span>
</div>
```

### api.service.ts
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  isNameTaken(name: string): Observable<boolean> {
    return this.http.get<boolean>(`/api/check-name?name=${name}`);
  }

  isEmailTaken(email: string): Observable<boolean> {
    return this.http.get<boolean>(`/api/check-email?email=${email}`);
  }

  signup(name: string, email: string, password: string): Observable<any> {
    return this.http.post('/api/signup', { name, email, password });
  }
}
```

### auth.actions.ts
```typescript
import { Injectable } from '@angular/core';
import { createAction, props } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class AuthActions {
  signupComplete = createAction('[Auth] Signup Complete', props<{ user: any }>());
}
```
```

### Tokens: {'input_tokens': 1196, 'output_tokens': 1110}
### Execution time: 71.88449215888977
