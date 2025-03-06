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
# signup.component.ts
```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Observable, firstValueFrom } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import * as api from '../api';
import * as AuthActions from '../actions/auth.actions';
import { getTitle } from './utils';
import { AppState } from '../store/app.state';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  submitting = false;
  asyncValidating = false;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private titleService: Title
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle(getTitle('Signup'));
    
    // Setup async validators
    this.setupAsyncValidators();
  }

  setupAsyncValidators(): void {
    // Name field async validation
    this.signupForm.get('name')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(name => {
        if (name && name.length >= 3) {
          this.asyncValidating = true;
          this.validateName(name);
        }
      });

    // Email field async validation
    this.signupForm.get('email')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(email => {
        if (email && this.signupForm.get('email')?.valid) {
          this.asyncValidating = true;
          this.validateEmail(email);
        }
      });
  }

  async validateName(name: string): Promise<void> {
    try {
      const result = await firstValueFrom(api.isName(name));
      if (result.data) {
        this.signupForm.get('name')?.setErrors({ nameExists: 'This name is already in use' });
      }
    } catch (error) {
      console.error('Error validating name:', error);
    } finally {
      this.asyncValidating = false;
    }
  }

  async validateEmail(email: string): Promise<void> {
    try {
      const result = await firstValueFrom(api.isEmail(email));
      if (result.data) {
        this.signupForm.get('email')?.setErrors({ emailExists: 'This email is already in use' });
      }
    } catch (error) {
      console.error('Error validating email:', error);
    } finally {
      this.asyncValidating = false;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.signupForm.invalid || this.submitting) {
      return;
    }

    this.submitting = true;
    const { name, email, password } = this.signupForm.value;

    try {
      const result = await firstValueFrom(api.signup(name, email, password));
      this.store.dispatch(AuthActions.signupComplete({ data: result.data }));
    } catch (error: any) {
      // Handle form errors
      if (error.data) {
        const errorData = error.data;
        Object.keys(errorData).forEach(key => {
          if (this.signupForm.get(key)) {
            this.signupForm.get(key)?.setErrors({ serverError: errorData[key] });
          }
        });
      }
    } finally {
      this.submitting = false;
    }
  }

  getFieldError(fieldName: string): string | null {
    const field = this.signupForm.get(fieldName);
    if (field?.touched && field?.errors) {
      if (field.errors['required']) return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      if (field.errors['minlength']) return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['maxlength']) return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be less than ${field.errors['maxlength'].requiredLength} characters`;
      if (field.errors['email']) return 'A valid email address is required';
      if (field.errors['nameExists']) return field.errors['nameExists'];
      if (field.errors['emailExists']) return field.errors['emailExists'];
      if (field.errors['serverError']) return field.errors['serverError'];
    }
    return null;
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.signupForm.get(fieldName);
    return field?.valid && field?.touched ? true : false;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.signupForm.get(fieldName);
    return field?.invalid && field?.touched ? true : false;
  }
}
```

# signup.component.html
```html
<div>
  <h2>Join PodBaby today.</h2>
  <hr />
  <p class="lead">
    As a member you can subscribe to podcast feeds and keep track of your favorite episodes.
  </p>
  <form class="form-horizontal" [formGroup]="signupForm" (ngSubmit)="onSubmit()">
    <app-form-group [valid]="isFieldValid('name')" [invalid]="isFieldInvalid('name')" [errorMessage]="getFieldError('name')">
      <input type="text" class="form-control" placeholder="Name" formControlName="name" />
    </app-form-group>

    <app-form-group [valid]="isFieldValid('email')" [invalid]="isFieldInvalid('email')" [errorMessage]="getFieldError('email')">
      <input type="email" class="form-control" placeholder="Email address" formControlName="email" />
    </app-form-group>

    <app-form-group [valid]="isFieldValid('password')" [invalid]="isFieldInvalid('password')" [errorMessage]="getFieldError('password')">
      <input type="password" class="form-control" placeholder="Password" formControlName="password" />
    </app-form-group>

    <button 
      class="btn btn-primary form-control" 
      type="submit" 
      [disabled]="signupForm.invalid || submitting || asyncValidating">
      <app-icon icon="sign-in"></app-icon> Signup
    </button>
  </form>
  <p><a routerLink="/login/">Already a member? Log in here.</a></p>
</div>
```

# form-group.component.ts
```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-group',
  templateUrl: './form-group.component.html',
  styleUrls: ['./form-group.component.scss']
})
export class FormGroupComponent {
  @Input() valid = false;
  @Input() invalid = false;
  @Input() errorMessage: string | null = null;
}
```

# form-group.component.html
```html
<div class="form-group" [ngClass]="{'has-success': valid, 'has-error': invalid, 'has-feedback': valid || invalid}">
  <ng-content></ng-content>
  <span *ngIf="invalid && errorMessage" class="help-block">{{ errorMessage }}</span>
</div>
```

# auth.actions.ts
```typescript
import { createAction, props } from '@ngrx/store';

export const signupComplete = createAction(
  '[Auth] Signup Complete',
  props<{ data: any }>()
);
```

# app.module.ts
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { FormGroupComponent } from './components/form-group/form-group.component';
import { IconComponent } from './components/icon/icon.component';
import { reducers } from './store/reducers';
import { AuthEffects } from './effects/auth.effects';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    FormGroupComponent,
    IconComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: 'signup', component: SignupComponent },
      { path: 'login', redirectTo: '/login', pathMatch: 'full' },
      { path: '', redirectTo: '/home', pathMatch: 'full' }
    ]),
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([AuthEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### Tokens: {'input_tokens': 1575, 'output_tokens': 2515}
### Execution time: 29.196946144104004
