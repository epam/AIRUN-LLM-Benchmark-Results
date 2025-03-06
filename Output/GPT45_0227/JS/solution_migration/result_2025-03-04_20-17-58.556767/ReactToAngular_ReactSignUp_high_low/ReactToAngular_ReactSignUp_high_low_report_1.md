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
### signup.component.ts
```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap } from 'rxjs/operators';
import { AuthActions } from '../store/actions/auth.actions';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)], [this.nameExistsValidator()]],
      email: ['', [Validators.required, Validators.email], [this.emailExistsValidator()]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  nameExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);
      return control.valueChanges.pipe(
        debounceTime(500),
        switchMap(name => this.apiService.isName(name)),
        map(result => result.data ? { nameExists: true } : null),
        catchError(() => of(null))
      );
    };
  }

  emailExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);
      return control.valueChanges.pipe(
        debounceTime(500),
        switchMap(email => this.apiService.isEmail(email)),
        map(result => result.data ? { emailExists: true } : null),
        catchError(() => of(null))
      );
    };
  }

  submit(): void {
    if (this.signupForm.invalid) return;
    this.submitting = true;
    const { name, email, password } = this.signupForm.value;
    this.apiService.signup(name, email, password).subscribe({
      next: result => {
        this.store.dispatch(AuthActions.signupComplete({ user: result.data }));
        this.router.navigate(['/']);
      },
      error: () => {
        this.submitting = false;
      }
    });
  }
}
```

### signup.component.html
```html
<div class="container">
  <h2>Join PodBaby today.</h2>
  <hr />
  <p class="lead">
    As a member you can subscribe to podcast feeds and keep track of your favorite episodes.
  </p>

  <form [formGroup]="signupForm" (ngSubmit)="submit()">
    <app-form-group [control]="signupForm.get('name')" placeholder="Name"></app-form-group>
    <app-form-group [control]="signupForm.get('email')" placeholder="Email address" type="email"></app-form-group>
    <app-form-group [control]="signupForm.get('password')" placeholder="Password" type="password"></app-form-group>

    <button class="btn btn-primary form-control" type="submit" [disabled]="submitting || signupForm.invalid">
      <app-icon icon="sign-in"></app-icon> Signup
    </button>
  </form>

  <p><a routerLink="/login">Already a member? Log in here.</a></p>
</div>
```

### form-group.component.ts
```typescript
import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-group',
  templateUrl: './form-group.component.html'
})
export class FormGroupComponent {
  @Input() control: AbstractControl;
  @Input() placeholder: string;
  @Input() type = 'text';

  get isInvalid(): boolean {
    return this.control.touched && this.control.invalid;
  }

  get errorMessage(): string {
    if (this.control.errors?.required) return 'This field is required';
    if (this.control.errors?.minlength) return `Minimum length is ${this.control.errors.minlength.requiredLength}`;
    if (this.control.errors?.maxlength) return `Maximum length is ${this.control.errors.maxlength.requiredLength}`;
    if (this.control.errors?.email) return 'A valid email address is required';
    if (this.control.errors?.nameExists) return 'This name is already in use';
    if (this.control.errors?.emailExists) return 'This email is already in use';
    return '';
  }
}
```

### form-group.component.html
```html
<div class="form-group" [ngClass]="{'has-error': isInvalid, 'has-success': control.touched && control.valid}">
  <input [type]="type" class="form-control" [placeholder]="placeholder" [formControl]="control" />
  <span *ngIf="isInvalid" class="help-block">{{ errorMessage }}</span>
</div>
```

### api.service.ts (partial, assuming other methods exist)
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  isName(name: string): Observable<{ data: boolean }> {
    return this.http.get<{ data: boolean }>(`/api/is-name?name=${encodeURIComponent(name)}`);
  }

  isEmail(email: string): Observable<{ data: boolean }> {
    return this.http.get<{ data: boolean }>(`/api/is-email?email=${encodeURIComponent(email)}`);
  }

  signup(name: string, email: string, password: string): Observable<{ data: any }> {
    return this.http.post<{ data: any }>('/api/signup', { name, email, password });
  }
}
```

### auth.actions.ts (partial)
```typescript
import { createAction, props } from '@ngrx/store';

export const AuthActions = {
  signupComplete: createAction('[Auth] Signup Complete', props<{ user: any }>())
};
```

### icon.component.ts (assuming already migrated)
```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  template: `<i class="fa fa-{{icon}}"></i>`
})
export class IconComponent {
  @Input() icon: string;
}
```

### app-routing.module.ts (partial)
```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './components/signup.component';
import { LoginComponent } from './components/login.component';

const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/signup', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```

### app.module.ts (partial)
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppRoutingModule } from './app-routing.module';
import { SignupComponent } from './components/signup.component';
import { FormGroupComponent } from './components/form-group.component';
import { IconComponent } from './components/icon.component';

@NgModule({
  declarations: [
    SignupComponent,
    FormGroupComponent,
    IconComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([])
  ],
  bootstrap: [SignupComponent]
})
export class AppModule {}
```

### Tokens: {'input_tokens': 1273, 'output_tokens': 1743, 'reasoning_tokens': 0}
### Execution time: 53.82880997657776
