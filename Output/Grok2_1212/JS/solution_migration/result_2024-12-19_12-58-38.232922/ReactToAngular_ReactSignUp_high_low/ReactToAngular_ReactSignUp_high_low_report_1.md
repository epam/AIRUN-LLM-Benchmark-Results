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
Here's the migrated code from React to Angular 14.x, split into multiple components and services for better organization and reusability:

**signup.component.ts**
```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SignupService } from './signup.service';
import { AuthActions } from '../store/auth.actions';
import { selectAuthLoading } from '../store/auth.selectors';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  loading$: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private signupService: SignupService,
    private store: Store
  ) {}

  ngOnInit() {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.loading$ = this.store.select(selectAuthLoading);
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const { name, email, password } = this.signupForm.value;
      this.signupService.signup(name, email, password).pipe(
        tap(result => {
          this.store.dispatch(AuthActions.signupComplete({ user: result }));
        })
      ).subscribe();
    }
  }
}
```

**signup.component.html**
```html
<div>
  <h2>Join PodBaby today.</h2>
  <hr>
  <p class="lead">
    As a member you can subscribe to podcast feeds and keep track of your favorite episodes.
  </p>
  <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
    <app-form-group formControlName="name">
      <input type="text" class="form-control" placeholder="Name">
    </app-form-group>

    <app-form-group formControlName="email">
      <input type="email" class="form-control" placeholder="Email address">
    </app-form-group>

    <app-form-group formControlName="password">
      <input type="password" class="form-control" placeholder="Password">
    </app-form-group>
    <button type="submit" class="btn btn-primary form-control" [disabled]="signupForm.invalid || (loading$ | async)">
      <i class="icon-sign-in"></i> Signup
    </button>
  </form>
  <p><a routerLink="/login">Already a member? Log in here.</a></p>
</div>
```

**signup.service.ts**
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  constructor(private api: ApiService, private http: HttpClient) {}

  signup(name: string, email: string, password: string): Observable<any> {
    return this.api.signup(name, email, password).pipe(
      mergeMap(result => this.validateSignup(name, email).pipe(
        mergeMap(() => of(result)),
        catchError(error => of(error))
      )),
      catchError(error => of(error))
    );
  }

  private validateSignup(name: string, email: string): Observable<any> {
    return this.api.isName(name).pipe(
      mergeMap(nameResult => {
        if (nameResult.data) {
          return of({ name: 'This name is already in use' });
        }
        return this.api.isEmail(email).pipe(
          mergeMap(emailResult => {
            if (emailResult.data) {
              return of({ email: 'This email is already in use' });
            }
            return of({});
          })
        );
      })
    );
  }
}
```

**form-group.component.ts**
```typescript
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-group',
  template: `
    <div [ngClass]="{'has-error': control.touched && control.invalid, 'has-success': control.touched && control.valid}">
      <ng-content></ng-content>
      <span *ngIf="control.touched && control.invalid" class="help-block">
        {{ getErrorMessage() }}
      </span>
    </div>
  `
})
export class FormGroupComponent {
  @Input() control: FormControl;

  getErrorMessage() {
    if (this.control.hasError('required')) {
      return 'This field is required';
    }
    if (this.control.hasError('minlength')) {
      return `Minimum length ${this.control.errors.minlength.requiredLength}`;
    }
    if (this.control.hasError('maxlength')) {
      return `Maximum length ${this.control.errors.maxlength.requiredLength}`;
    }
    if (this.control.hasError('email')) {
      return 'A valid email address is required';
    }
    return '';
  }
}
```

**auth.actions.ts**
```typescript
import { createAction, props } from '@ngrx/store';

export const signupComplete = createAction(
  '[Auth] Signup Complete',
  props<{ user: any }>()
);
```

**auth.reducers.ts**
```typescript
import { createReducer, on } from '@ngrx/store';
import { signupComplete } from './auth.actions';

export interface AuthState {
  user: any;
  loading: boolean;
}

export const initialState: AuthState = {
  user: null,
  loading: false
};

export const authReducer = createReducer(
  initialState,
  on(signupComplete, (state, { user }) => ({ ...state, user, loading: false }))
);
```

**auth.selectors.ts**
```typescript
import { createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducers';

export const selectAuthState = (state: any) => state.auth;

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.loading
);
```

**app.module.ts** (partial)
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { FormGroupComponent } from './form-group/form-group.component';
import { authReducer } from './store/auth.reducers';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    FormGroupComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    StoreModule.forRoot({ auth: authReducer }),
    EffectsModule.forRoot([])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### Tokens: {'input_tokens': 1251, 'output_tokens': 1578}
### Execution time: 24.10611915588379
