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
```ts
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap, first } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { ApiService } from '../services/api.service';
import * as AuthActions from '../store/actions/auth.actions';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private store: Store,
    private titleService: Title,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Signup - PodBaby');
    this.signupForm = this.fb.group({
      name: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(60)],
        [this.nameAsyncValidator()]
      ],
      email: [
        '',
        [Validators.required, Validators.email],
        [this.emailAsyncValidator()]
      ],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  nameAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      return of(control.value).pipe(
        debounceTime(300),
        switchMap(name => this.apiService.isName(name)),
        map(result => (result.data ? { nameInUse: 'This name is already in use' } : null)),
        catchError(() => of(null)),
        first()
      );
    };
  }

  emailAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      return of(control.value).pipe(
        debounceTime(300),
        switchMap(email => this.apiService.isEmail(email)),
        map(result => (result.data ? { emailInUse: 'This email is already in use' } : null)),
        catchError(() => of(null)),
        first()
      );
    };
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      return;
    }
    this.submitting = true;
    const { name, email, password } = this.signupForm.value;
    this.apiService.signup(name, email, password).subscribe(
      result => {
        this.store.dispatch(AuthActions.signupComplete({ data: result.data }));
        this.submitting = false;
      },
      error => {
        this.submitting = false;
      }
    );
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
    <app-form-group [control]="signupForm.controls.name">
      <input type="text" formControlName="name" class="form-control" placeholder="Name" />
    </app-form-group>

    <app-form-group [control]="signupForm.controls.email">
      <input type="email" formControlName="email" class="form-control" placeholder="Email address" />
    </app-form-group>

    <app-form-group [control]="signupForm.controls.password">
      <input type="password" formControlName="password" class="form-control" placeholder="Password" />
    </app-form-group>

    <button
      type="submit"
      class="btn btn-primary form-control"
      [disabled]="submitting || signupForm.pending"
    >
      <i class="fa fa-sign-in"></i> Signup
    </button>
  </form>
  <p><a routerLink="/login">Already a member? Log in here.</a></p>
</div>
```

form-group.component.ts
```ts
import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-group',
  template: `
    <div [ngClass]="{ 'has-error': control.touched && control.invalid, 'has-success': control.touched && control.valid }">
      <ng-content></ng-content>
      <span *ngIf="control.touched && control.invalid" class="help-block">
        {{ getErrorMessage() }}
      </span>
    </div>
  `
})
export class FormGroupComponent {
  @Input() control!: AbstractControl;

  getErrorMessage(): string {
    if (this.control.errors) {
      if (this.control.errors.required) {
        return 'This field is required';
      }
      if (this.control.errors.minlength) {
        return `Minimum ${this.control.errors.minlength.requiredLength} characters required`;
      }
      if (this.control.errors.maxlength) {
        return `Maximum ${this.control.errors.maxlength.requiredLength} characters allowed`;
      }
      if (this.control.errors.email) {
        return 'A valid email address is required';
      }
      if (this.control.errors.nameInUse) {
        return this.control.errors.nameInUse;
      }
      if (this.control.errors.emailInUse) {
        return this.control.errors.emailInUse;
      }
    }
    return '';
  }
}
```

api.service.ts
```ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  isName(name: string): Observable<any> {
    return this.http.get<any>(`/api/isName?name=${encodeURIComponent(name)}`);
  }

  isEmail(email: string): Observable<any> {
    return this.http.get<any>(`/api/isEmail?email=${encodeURIComponent(email)}`);
  }

  signup(name: string, email: string, password: string): Observable<any> {
    return this.http.post<any>('/api/signup', { name, email, password });
  }
}
```

auth.actions.ts
```ts
import { createAction, props } from '@ngrx/store';

export const signupComplete = createAction(
  '[Auth] Signup Complete',
  props<{ data: any }>()
);
```

### Tokens: {'input_tokens': 1272, 'output_tokens': 3357, 'reasoning_tokens': 1920}
### Execution time: 20.542317867279053
