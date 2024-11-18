Your task is to write unit-tests for a legacy part of frontend application.

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


When performing this task, please adhere to the following instructions:
- Choose libraries for testing.
- Set up the testing environment.
- Aim to cover at least 80% of the code.
- Use mocking for dependencies if necessary.
- Ensure that the generated code does not contain any TODOs.
- Simply return the codebase without additional comments.
## Run 1:
### Answer:
```javascript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { reducer as formReducer } from 'redux-form';
import { Signup } from './signup';
import * as api from '../api'; // Assuming api.js is in the same directory

jest.mock('../api');

const initialState = {};
const store = createStore(
  (state = initialState, action) => ({ ...state, form: formReducer(state.form, action) }),
  applyMiddleware(thunk)
);

describe('Signup Component', () => {
  it('renders signup form', () => {
    render(
      <Provider store={store}>
        <Signup />
      </Provider>
    );

    expect(screen.getByText('Join PodBaby today.')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Signup')).toBeInTheDocument();
  });

  it('validates form fields', () => {
    render(
      <Provider store={store}>
        <Signup />
      </Provider>
    );

    const nameInput = screen.getByPlaceholderText('Name');
    const emailInput = screen.getByPlaceholderText('Email address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByText('Signup');

    fireEvent.click(submitButton);

    expect(screen.getByText('Name must be between 3 and 60 characters in length')).toBeVisible();
    expect(screen.getByText('A valid email address is required')).toBeVisible();
    expect(screen.getByText('Password must be at least 6 characters')).toBeVisible();

    fireEvent.change(nameInput, { target: { value: 'ab' } });
    fireEvent.blur(nameInput);
    expect(screen.getByText('Name must be between 3 and 60 characters in length')).toBeVisible();

    fireEvent.change(nameInput, { target: { value: 'validname' } });
    fireEvent.blur(nameInput);
    expect(screen.queryByText('Name must be between 3 and 60 characters in length')).not.toBeVisible();

    fireEvent.change(emailInput, { target: { value: 'invalid email' } });
    fireEvent.blur(emailInput);
    expect(screen.getByText('A valid email address is required')).toBeVisible();

    fireEvent.change(emailInput, { target: { value: 'valid@email.com' } });
    fireEvent.blur(emailInput);
    expect(screen.queryByText('A valid email address is required')).not.toBeVisible();

    fireEvent.change(passwordInput, { target: { value: '12345' } });
    fireEvent.blur(passwordInput);
    expect(screen.getByText('Password must be at least 6 characters')).toBeVisible();

    fireEvent.change(passwordInput, { target: { value: 'validpassword' } });
    fireEvent.blur(passwordInput);
    expect(screen.queryByText('Password must be at least 6 characters')).not.toBeVisible();
  });

  it('handles async validation', async () => {
    api.isName.mockResolvedValue({ data: true });
    api.isEmail.mockResolvedValue({ data: false });

    render(
      <Provider store={store}>
        <Signup />
      </Provider>
    );

    const nameInput = screen.getByPlaceholderText('Name');
    fireEvent.change(nameInput, { target: { value: 'takenname' } });
    fireEvent.blur(nameInput);

    // Wait for async validation to complete
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(screen.getByText('This name is already in use')).toBeVisible();
  });

  it('submits form successfully', async () => {
    api.signup.mockResolvedValue({ data: { token: 'testtoken' } });

    render(
      <Provider store={store}>
        <Signup />
      </Provider>
    );

    const nameInput = screen.getByPlaceholderText('Name');
    const emailInput = screen.getByPlaceholderText('Email address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByText('Signup');

    fireEvent.change(nameInput, { target: { value: 'validname' } });
    fireEvent.change(emailInput, { target: { value: 'valid@email.com' } });
    fireEvent.change(passwordInput, { target: { value: 'validpassword' } });
    fireEvent.click(submitButton);

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(api.signup).toHaveBeenCalledWith('validname', 'valid@email.com', 'validpassword');
  });
});

```

### Tokens: {'input_tokens': 1407, 'output_tokens': 1172}
### Execution time: 23.83852195739746
