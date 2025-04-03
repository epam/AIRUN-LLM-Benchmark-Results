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
```ts
// signup.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError, debounceTime, switchMap, first } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AppState } from '../../store';
import { signup } from '../../store/auth/auth.actions';
import { isEmail, isName } from '../../api/api.service';
import { getTitle } from '../../utils/title.util';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  submitting = false;
  title = getTitle('Signup');

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)], [this.nameAsyncValidator()]],
      email: ['', [Validators.required, Validators.email], [this.emailAsyncValidator()]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.signupForm.invalid) return;

    this.submitting = true;
    const { name, email, password } = this.signupForm.value;

    this.store.dispatch(signup({ name, email, password }));
  }

  private nameAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);
      return of(control.value).pipe(
        debounceTime(300),
        switchMap(name => isName(name)),
        map(result => (result.data ? { nameTaken: 'This name is already in use' } : null)),
        catchError(() => of(null)),
        first()
      );
    };
  }

  private emailAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);
      return of(control.value).pipe(
        debounceTime(300),
        switchMap(email => isEmail(email)),
        map(result => (result.data ? { emailTaken: 'This email is already in use' } : null)),
        catchError(() => of(null)),
        first()
      );
    };
  }

  get name() { return this.signupForm.get('name'); }
  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }
}
```

```html
<!-- signup.component.html -->
<app-document-title [title]="title">
  <div>
    <h2>Join PodBaby today.</h2>
    <hr />
    <p class="lead">
      As a member you can subscribe to podcast feeds and keep track of your favorite episodes.
    </p>
    <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="form-horizontal">
      <app-form-group [control]="name" label="Name">
        <input type="text" class="form-control" placeholder="Name" formControlName="name" />
      </app-form-group>

      <app-form-group [control]="email" label="Email address">
        <input type="email" class="form-control" placeholder="Email address" formControlName="email" />
      </app-form-group>

      <app-form-group [control]="password" label="Password">
        <input type="password" class="form-control" placeholder="Password" formControlName="password" />
      </app-form-group>

      <button
        class="btn btn-primary form-control"
        [disabled]="submitting || signupForm.invalid"
        type="submit"
      >
        <app-icon icon="sign-in"></app-icon> Signup
      </button>
    </form>
    <p><a routerLink="/login/">Already a member? Log in here.</a></p>
  </div>
</app-document-title>
```

```ts
// form-group.component.ts
import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-group',
  templateUrl: './form-group.component.html'
})
export class FormGroupComponent {
  @Input() control!: AbstractControl;
  @Input() label!: string;

  get showError(): boolean {
    return this.control.touched && this.control.invalid;
  }

  get errorMessage(): string | null {
    if (!this.control.errors) return null;
    const errors = this.control.errors;
    if (errors['required']) return `${this.label} is required`;
    if (errors['minlength']) return `${this.label} must be at least ${errors['minlength'].requiredLength} characters`;
    if (errors['maxlength']) return `${this.label} must be at most ${errors['maxlength'].requiredLength} characters`;
    if (errors['email']) return 'A valid email address is required';
    if (errors['nameTaken']) return errors['nameTaken'];
    if (errors['emailTaken']) return errors['emailTaken'];
    return null;
  }
}
```

```html
<!-- form-group.component.html -->
<div class="form-group" [ngClass]="{'has-error': showError, 'has-success': control.touched && control.valid}">
  <ng-content></ng-content>
  <span *ngIf="showError" class="help-block">{{ errorMessage }}</span>
</div>
```

```ts
// auth.actions.ts
import { createAction, props } from '@ngrx/store';

export const signup = createAction(
  '[Auth] Signup',
  props<{ name: string; email: string; password: string }>()
);

export const signupSuccess = createAction(
  '[Auth] Signup Success',
  props<{ user: any }>()
);

export const signupFailure = createAction(
  '[Auth] Signup Failure',
  props<{ error: any }>()
);
```

```ts
// auth.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { signup, signupSuccess, signupFailure } from './auth.actions';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiService } from '../../api/api.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private api: ApiService,
    private router: Router
  ) {}

  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signup),
      switchMap(({ name, email, password }) =>
        this.api.signup(name, email, password).pipe(
          map(response => {
            this.router.navigate(['/']);
            return signupSuccess({ user: response.data });
          }),
          catchError(error => of(signupFailure({ error: error.data })))
        )
      )
    )
  );
}
```

```ts
// api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  signup(name: string, email: string, password: string): Observable<any> {
    return this.http.post('/api/signup', { name, email, password });
  }

  isName(name: string): Observable<any> {
    return this.http.get(`/api/check-name?name=${encodeURIComponent(name)}`);
  }

  isEmail(email: string): Observable<any> {
    return this.http.get(`/api/check-email?email=${encodeURIComponent(email)}`);
  }
}
```

```ts
// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './auth/signup/signup.component';

const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', loadChildren: () => import('./auth/login/login.module').then(m => m.LoginModule) },
  { path: '', redirectTo: '/signup', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```

```ts
// icon.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  template: `<i [class]="'fa fa-' + icon"></i>`
})
export class IconComponent {
  @Input() icon!: string;
}
```

```ts
// document-title.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-document-title',
  template: `<ng-content></ng-content>`
})
export class DocumentTitleComponent implements OnInit {
  @Input() title!: string;

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
  }
}
```

### Tokens: {'input_tokens': 1486, 'output_tokens': 1991, 'reasoning_tokens': 0}
### Execution time: 12.934153318405151
