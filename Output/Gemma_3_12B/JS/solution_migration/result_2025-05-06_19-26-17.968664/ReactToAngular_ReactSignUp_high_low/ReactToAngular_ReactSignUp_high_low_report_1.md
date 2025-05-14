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
```markdown
**signup.component.ts**

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { AppState } from '../store/app.state';
import { signup, signupComplete } from '../store/auth.actions';
import { getTitle } from './utils';
import { FormGroupComponent } from '../components/form-group.component';
import { IconComponent } from '../components/icon.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  submitting: boolean = false;
  errorMessage: string | null = null;
  title$: Observable<string> = this.titleService.getTitle();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private store: Store<AppState>
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {}

  async onSubmit() {
    this.submitting = true;
    this.errorMessage = null;

    const name = this.signupForm.get('name')?.value;
    const email = this.signupForm.get('email')?.value;
    const password = this.signupForm.get('password')?.value;

    try {
      const result = await this.authService.signup(name, email, password).toPromise();
      this.store.dispatch(signupComplete({ result: result.data }));
      this.signupForm.reset();
    } catch (error: any) {
      this.errorMessage = error.error?.message || 'Signup failed.';
    } finally {
      this.submitting = false;
    }
  }

  isNameAvailable(name: string): Observable<boolean> {
    return this.authService.isName(name).pipe(
      map((result: any) => !result.data)
    );
  }

  isEmailAvailable(email: string): Observable<boolean> {
    return this.authService.isEmail(email).pipe(
      map((result: any) => !result.data)
    );
  }
}

```

**signup.component.html**

```html
<div class="container">
  <h2 class="mb-3">Join PodBaby today.</h2>
  <hr />
  <p class="lead">As a member you can subscribe to podcast feeds and keep track of your favorite episodes.</p>

  <form class="form-horizontal" (ngSubmit)="onSubmit()" [formGroup]="signupForm">
    <form-group [field]="signupForm.get('name')" [label]="'Name'">
      <input type="text" class="form-control" placeholder="Name" [formControl]="signupForm.get('name')">
    </form-group>

    <form-group [field]="signupForm.get('email')" [label]="'Email address'">
      <input type="email" class="form-control" placeholder="Email address" [formControl]="signupForm.get('email')">
    </form-group>

    <form-group [field]="signupForm.get('password')" [label]="'Password'">
      <input type="password" class="form-control" placeholder="Password" [formControl]="signupForm.get('password')">
    </form-group>

    <button
      type="submit"
      class="btn btn-primary form-control"
      [disabled]="submitting"
    >
      <icon icon="sign-in"></icon> Signup
    </button>
  </form>

  <p>
    <router-link to="/login/">Already a member? Log in here.</router-link>
  </p>
</div>
```

**form-group.component.ts**

```typescript
import { Component, Input } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'form-group',
  template: `
    <div class="form-group">
      <label class="control-label" *ngIf="label">{{ label }}</label>
      <input
        type="text"
        class="form-control"
        [formControl]="field"
        [hasFeedback]="field.touched"
      />
      <span class="help-block" *ngIf="field.touched && field.error">
        {{ field.error }}
      </span>
    </div>
  `,
})
export class FormGroupComponent {
  @Input() field: AbstractControl;
  @Input() label: string = '';
}
```

**form-group.component.html**

```html
<div class="form-group">
  <label class="control-label" *ngIf="label">{{ label }}</label>
  <input
    type="text"
    class="form-control"
    [formControl]="field"
    [hasFeedback]="field.touched"
  />
  <span class="help-block" *ngIf="field.touched && field.error">
    {{ field.error }}
  </span>
</div>
```

**icon.component.ts**

```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon',
  template: `<span class="icon">{{ icon }}</span>`,
})
export class IconComponent {
  @Input() icon: string = '';
}
```

**icon.component.html**

```html
<span class="icon">{{ icon }}</span>
```

**auth.service.ts**

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  signup(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, { name, email, password });
  }

  isName(name: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/checkName?name=${name}`);
  }

  isEmail(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/checkEmail?email=${email}`);
  }
}
```

**auth.actions.ts**

```typescript
import { createAction, Action } from '@ngrx/store';

export const signupComplete = createAction(
  '[Auth] Signup Complete',
  (result) => ({
    result,
  })
);
```

**app.state.ts**

```typescript
import { createFeatureSelector } from '@ngrx/store';

export interface AppState {
  auth: {
    result: any;
  };
}
```

**utils.ts**

```typescript
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(private titleService: Title) {}

  getTitle(pageTitle: string): string {
    return `${pageTitle} - PodBaby`;
  }
}
```


### Tokens: {'input_tokens': 1705, 'output_tokens': 1831}
### Execution time: 79.1576509475708
