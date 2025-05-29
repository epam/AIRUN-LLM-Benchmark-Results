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
// signup.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, of } from 'rxjs';
import { takeUntil, debounceTime, switchMap, map, catchError } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

import { ApiService } from '../services/api.service';
import { AuthActions } from '../store/auth/auth.actions';
import { getTitle } from '../utils/utils';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  signupForm: FormGroup;
  submitting = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private store: Store,
    private router: Router,
    private titleService: Title
  ) {
    this.signupForm = this.createForm();
  }

  ngOnInit(): void {
    this.titleService.setTitle(getTitle('Signup'));
    this.setupAsyncValidation();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(60)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]
    });
  }

  private setupAsyncValidation(): void {
    this.signupForm.get('name')?.valueChanges.pipe(
      debounceTime(300),
      switchMap(name => this.validateNameAsync(name)),
      takeUntil(this.destroy$)
    ).subscribe();

    this.signupForm.get('email')?.valueChanges.pipe(
      debounceTime(300),
      switchMap(email => this.validateEmailAsync(email)),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  private validateNameAsync(name: string): Observable<void> {
    if (!name || name.length < 3) {
      return of();
    }

    return this.apiService.isName(name).pipe(
      map(result => {
        const nameControl = this.signupForm.get('name');
        if (result.data) {
          nameControl?.setErrors({ nameExists: 'This name is already in use' });
        } else {
          const errors = nameControl?.errors;
          if (errors && errors['nameExists']) {
            delete errors['nameExists'];
            nameControl?.setErrors(Object.keys(errors).length ? errors : null);
          }
        }
      }),
      catchError(() => of())
    );
  }

  private validateEmailAsync(email: string): Observable<void> {
    if (!email || !this.isValidEmail(email)) {
      return of();
    }

    return this.apiService.isEmail(email).pipe(
      map(result => {
        const emailControl = this.signupForm.get('email');
        if (result.data) {
          emailControl?.setErrors({ emailExists: 'This email is already in use' });
        } else {
          const errors = emailControl?.errors;
          if (errors && errors['emailExists']) {
            delete errors['emailExists'];
            emailControl?.setErrors(Object.keys(errors).length ? errors : null);
          }
        }
      }),
      catchError(() => of())
    );
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onSubmit(): void {
    if (this.signupForm.valid && !this.submitting) {
      this.submitting = true;
      const { name, email, password } = this.signupForm.value;

      this.apiService.signup(name, email, password).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (result) => {
          this.store.dispatch(AuthActions.signupComplete({ user: result.data }));
          this.submitting = false;
        },
        error: (error) => {
          this.handleSubmitError(error.data);
          this.submitting = false;
        }
      });
    }
  }

  private handleSubmitError(errorData: any): void {
    if (errorData && typeof errorData === 'object') {
      Object.keys(errorData).forEach(field => {
        const control = this.signupForm.get(field);
        if (control) {
          control.setErrors({ serverError: errorData[field] });
        }
      });
    }
  }

  getFieldError(fieldName: string): string | null {
    const field = this.signupForm.get(fieldName);
    if (field && field.touched && field.errors) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        if (fieldName === 'name') {
          return 'Name must be between 3 and 60 characters in length';
        }
        if (fieldName === 'password') {
          return 'Password must be at least 6 characters';
        }
      }
      if (field.errors['maxlength']) {
        return 'Name must be between 3 and 60 characters in length';
      }
      if (field.errors['email']) {
        return 'A valid email address is required';
      }
      if (field.errors['nameExists']) {
        return field.errors['nameExists'];
      }
      if (field.errors['emailExists']) {
        return field.errors['emailExists'];
      }
      if (field.errors['serverError']) {
        return field.errors['serverError'];
      }
    }
    return null;
  }

  isFieldValid(fieldName: string): boolean | null {
    const field = this.signupForm.get(fieldName);
    if (field && field.touched) {
      return field.valid;
    }
    return null;
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
  <form class="form-horizontal" [formGroup]="signupForm" (ngSubmit)="onSubmit()">
    <app-form-group 
      [field]="signupForm.get('name')" 
      [error]="getFieldError('name')" 
      [isValid]="isFieldValid('name')">
      <input 
        type="text" 
        class="form-control" 
        placeholder="Name" 
        formControlName="name" />
    </app-form-group>

    <app-form-group 
      [field]="signupForm.get('email')" 
      [error]="getFieldError('email')" 
      [isValid]="isFieldValid('email')">
      <input 
        type="email" 
        class="form-control" 
        placeholder="Email address" 
        formControlName="email" />
    </app-form-group>

    <app-form-group 
      [field]="signupForm.get('password')" 
      [error]="getFieldError('password')" 
      [isValid]="isFieldValid('password')">
      <input 
        type="password" 
        class="form-control" 
        placeholder="Password" 
        formControlName="password" />
    </app-form-group>

    <button
      type="submit"
      class="btn btn-primary form-control"
      [disabled]="submitting || signupForm.invalid">
      <app-icon icon="sign-in"></app-icon> Signup
    </button>
  </form>
  <p><a routerLink="/login">Already a member? Log in here.</a></p>
</div>
```

```scss
/* signup.component.scss */
.form-horizontal {
  max-width: 400px;
  margin: 0 auto;
}

.lead {
  margin-bottom: 2rem;
}

.btn {
  margin-top: 1rem;
}

p:last-child {
  margin-top: 1rem;
  text-align: center;
}
```

```typescript
// form-group.component.ts
import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-group',
  templateUrl: './form-group.component.html',
  styleUrls: ['./form-group.component.scss']
})
export class FormGroupComponent {
  @Input() field: AbstractControl | null = null;
  @Input() error: string | null = null;
  @Input() isValid: boolean | null = null;

  get hasFeedback(): boolean {
    return this.field ? this.field.touched : false;
  }

  get bsStyle(): string {
    if (this.hasFeedback) {
      return this.isValid ? 'success' : 'error';
    }
    return '';
  }
}
```

```html
<!-- form-group.component.html -->
<div class="form-group" [class.has-feedback]="hasFeedback" [class.has-success]="bsStyle === 'success'" [class.has-error]="bsStyle === 'error'">
  <ng-content></ng-content>
  <span *ngIf="hasFeedback && error" class="help-block">{{ error }}</span>
</div>
```

```scss
/* form-group.component.scss */
.form-group {
  margin-bottom: 1rem;
}

.has-success .form-control {
  border-color: #5cb85c;
}

.has-error .form-control {
  border-color: #d9534f;
}

.help-block {
  display: block;
  margin-top: 5px;
  margin-bottom: 10px;
  color: #d9534f;
  font-size: 12px;
}

.has-feedback {
  position: relative;
}
```

```typescript
// api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  isName(name: string): Observable<{ data: boolean }> {
    return this.http.get<{ data: boolean }>(`/api/check-name/${name}`);
  }

  isEmail(email: string): Observable<{ data: boolean }> {
    return this.http.get<{ data: boolean }>(`/api/check-email/${email}`);
  }

  signup(name: string, email: string, password: string): Observable<{ data: any }> {
    return this.http.post<{ data: any }>('/api/signup', { name, email, password });
  }
}
```

```typescript
// auth.actions.ts
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Signup Complete': props<{ user: any }>(),
    'Login Complete': props<{ user: any }>(),
    'Logout': emptyProps(),
  }
});
```

```typescript
// utils.ts
export function getTitle(pageTitle: string): string {
  return `${pageTitle} - PodBaby`;
}
```

```typescript
// icon.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  template: `<i [class]="iconClass"></i>`,
  styleUrls: ['./icon.component.scss']
})
export class IconComponent {
  @Input() icon: string = '';

  get iconClass(): string {
    return `fa fa-${this.icon}`;
  }
}
```

```scss
/* icon.component.scss */
i {
  margin-right: 0.5rem;
}
```

### Tokens: {'input_tokens': 1819, 'output_tokens': 3310}
### Execution time: 35.153199195861816
