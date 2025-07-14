I have the following application code that needs comprehensive unit testing:

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

1. Set up a complete testing environment:
   - Select and install appropriate testing libraries for React components
   - Configure test runners and utilities for Redux-connected components
   - Set up mocking utilities for API calls and external dependencies

2. Write comprehensive unit tests for all components:
   - Test both presentational and container components
   - Cover form validation logic (both synchronous and asynchronous)
   - Test form submission handling and error states
   - Verify proper rendering of form elements and error messages

3. Implement proper test isolation:
   - Mock all external API calls and async operations
   - Create proper test fixtures for form data
   - Use test doubles for Redux store interactions
   - Isolate component tests from their dependencies

4. Ensure thorough test coverage:
   - Achieve minimum 80% code coverage across all files
   - Test all conditional branches and error handling paths
   - Verify form validation rules function correctly
   - Test both success and failure scenarios

5. Follow testing best practices:
   - Structure tests in a readable, maintainable way
   - Use descriptive test names that explain the expected behavior
   - Implement setup and teardown procedures as appropriate
   - Verify component lifecycle methods function correctly

6. Deliver production-ready test suite:
   - Ensure all tests pass consistently
   - Remove any debug code, console logs, or TODOs
   - Optimize tests for execution speed where possible
   - Provide clean, focused test implementations without extraneous comments
## Run 1:
### Answer:
```javascript
// signup.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { reduxForm, reducer as formReducer } from 'redux-form';
import { createStore, combineReducers } from 'redux';
import { MemoryRouter } from 'react-router-dom';
import Signup, { validate, asyncValidate } from './signup'; // Assuming the file is named signup.js
import * as api from '../api';
import * as authActions from '../actions/auth'; // Assuming auth actions are in ../actions/auth

jest.mock('../api');
jest.mock('../actions/auth');
jest.mock('./utils', () => ({
  getTitle: jest.fn(() => 'Mock Title'),
}));
jest.mock('react-document-title', () => ({ default: ({ title, children }) => <div data-testid="document-title">{title}{children}</div> }));
jest.mock('react-bootstrap', () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
}));
jest.mock('../components/icon', () => () => <span>Icon</span>);
jest.mock('../components/form', () => ({
  FormGroup: ({ field, children }) => (
    <div data-testid={`form-group-${field.name}`}>
      {children}
      {field.touched && field.error && <span data-testid="error">{field.error}</span>}
    </div>
  ),
}));

const mockStore = configureStore();
const initialState = { form: {} };
const store = mockStore(initialState);

const WrappedSignup = reduxForm({
  form: 'signup',
  fields: ['name', 'email', 'password'],
  validate,
  asyncValidate,
  asyncBlurFields: ['name', 'email'],
})(Signup);

const setup = (props = {}) => {
  const realStore = createStore(combineReducers({ form: formReducer }));
  return render(
    <Provider store={realStore}>
      <MemoryRouter>
        <WrappedSignup {...props} />
      </MemoryRouter>
    </Provider>
  );
};

describe('Signup Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.signup.mockResolvedValue({ data: { token: 'mock-token' } });
    api.isName.mockResolvedValue({ data: false });
    api.isEmail.mockResolvedValue({ data: false });
    authActions.signupComplete = jest.fn();
  });

  test('renders signup form correctly', () => {
    setup();
    expect(screen.getByText('Join PodBaby today.')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Signup')).toBeInTheDocument();
    expect(screen.getByText('Already a member? Log in here.')).toBeInTheDocument();
  });

  test('displays synchronous validation errors for name', async () => {
    const { findByTestId } = setup();
    const nameInput = screen.getByPlaceholderText('Name');
    fireEvent.change(nameInput, { target: { value: 'ab' } });
    fireEvent.blur(nameInput);
    expect(await findByTestId('error')).toHaveTextContent('Name must be between 3 and 60 characters in length');
  });

  test('displays synchronous validation errors for email', async () => {
    const { findByTestId } = setup();
    const emailInput = screen.getByPlaceholderText('Email address');
    fireEvent.change(emailInput, { target: { value: 'invalid' } });
    fireEvent.blur(emailInput);
    expect(await findByTestId('error')).toHaveTextContent('A valid email address is required');
  });

  test('displays synchronous validation errors for password', async () => {
    const { findByTestId } = setup();
    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.blur(passwordInput);
    expect(await findByTestId('error')).toHaveTextContent('Password must be at least 6 characters');
  });

  test('handles successful form submission', async () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'validname' } });
    fireEvent.change(screen.getByPlaceholderText('Email address'), { target: { value: 'valid@email.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'validpassword' } });
    fireEvent.click(screen.getByText('Signup'));
    await waitFor(() => expect(api.signup).toHaveBeenCalledWith('validname', 'valid@email.com', 'validpassword'));
    expect(authActions.signupComplete).toHaveBeenCalledWith({ token: 'mock-token' });
  });

  test('handles form submission error', async () => {
    api.signup.mockRejectedValue({ data: { error: 'Signup failed' } });
    setup();
    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'validname' } });
    fireEvent.change(screen.getByPlaceholderText('Email address'), { target: { value: 'valid@email.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'validpassword' } });
    fireEvent.click(screen.getByText('Signup'));
    await waitFor(() => expect(api.signup).toHaveBeenCalled());
  });

  test('disables submit button while submitting', () => {
    const { rerender } = setup({ submitting: true });
    expect(screen.getByText('Signup')).toBeDisabled();
    rerender(<WrappedSignup submitting={false} />);
    expect(screen.getByText('Signup')).not.toBeDisabled();
  });

  test('performs async validation for name in use', async () => {
    api.isName.mockResolvedValue({ data: true });
    setup();
    const nameInput = screen.getByPlaceholderText('Name');
    fireEvent.change(nameInput, { target: { value: 'takenname' } });
    fireEvent.blur(nameInput);
    await waitFor(() => expect(api.isName).toHaveBeenCalledWith('takenname'));
    expect(await screen.findByTestId('error')).toHaveTextContent('This name is already in use');
  });

  test('performs async validation for email in use', async () => {
    api.isEmail.mockResolvedValue({ data: true });
    setup();
    const emailInput = screen.getByPlaceholderText('Email address');
    fireEvent.change(emailInput, { target: { value: 'taken@email.com' } });
    fireEvent.blur(emailInput);
    await waitFor(() => expect(api.isEmail).toHaveBeenCalledWith('taken@email.com'));
    expect(await screen.findByTestId('error')).toHaveTextContent('This email is already in use');
  });

  test('validate function returns correct errors', () => {
    const values = { name: 'ab', email: 'invalid', password: 'short' };
    const errors = validate(values);
    expect(errors.name).toBe('Name must be between 3 and 60 characters in length');
    expect(errors.email).toBe('A valid email address is required');
    expect(errors.password).toBe('Password must be at least 6 characters');
  });

  test('validate function returns no errors for valid input', () => {
    const values = { name: 'validname', email: 'valid@email.com', password: 'validpassword' };
    const errors = validate(values);
    expect(errors).toEqual({});
  });

  test('asyncValidate function returns errors for taken name and email', async () => {
    api.isName.mockResolvedValue({ data: true });
    api.isEmail.mockResolvedValue({ data: true });
    const values = { name: 'takenname', email: 'taken@email.com' };
    const errors = await asyncValidate(values);
    expect(errors).toEqual({ name: 'This name is already in use', email: 'This email is already in use' });
  });

  test('asyncValidate function returns no errors for available name and email', async () => {
    api.isName.mockResolvedValue({ data: false });
    api.isEmail.mockResolvedValue({ data: false });
    const values = { name: 'availablename', email: 'available@email.com' };
    const errors = await asyncValidate(values);
    expect(errors).toEqual({});
  });
});
```

```javascript
// form.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { FormGroup } from './form'; // Assuming the file is named form.js

jest.mock('react-bootstrap', () => ({
  Input: ({ children, bsStyle, hasFeedback }) => (
    <div data-testid="input" data-bsstyle={bsStyle} data-hasfeedback={hasFeedback}>
      {children}
    </div>
  ),
}));

describe('FormGroup Component', () => {
  test('renders children correctly', () => {
    const field = { touched: false };
    render(
      <FormGroup field={field}>
        <input type="text" />
      </FormGroup>
    );
    expect(screen.getByTestId('input')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('shows error message when touched and error present', () => {
    const field = { touched: true, error: 'Error message' };
    render(
      <FormGroup field={field}>
        <input type="text" />
      </FormGroup>
    );
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.getByTestId('input')).toHaveAttribute('data-bsstyle', 'error');
    expect(screen.getByTestId('input')).toHaveAttribute('data-hasfeedback', 'true');
  });

  test('shows success style when touched and no error', () => {
    const field = { touched: true, error: null };
    render(
      <FormGroup field={field}>
        <input type="text" />
      </FormGroup>
    );
    expect(screen.queryByText('Error message')).not.toBeInTheDocument();
    expect(screen.getByTestId('input')).toHaveAttribute('data-bsstyle', 'success');
    expect(screen.getByTestId('input')).toHaveAttribute('data-hasfeedback', 'true');
  });

  test('does not show feedback when not touched', () => {
    const field = { touched: false, error: 'Error message' };
    render(
      <FormGroup field={field}>
        <input type="text" />
      </FormGroup>
    );
    expect(screen.queryByText('Error message')).not.toBeInTheDocument();
    expect(screen.getByTestId('input')).not.toHaveAttribute('data-bsstyle');
    expect(screen.getByTestId('input')).not.toHaveAttribute('data-hasfeedback');
  });
});
```

### Tokens: {'input_tokens': 1465, 'output_tokens': 2365, 'reasoning_tokens': 490}
### Execution time: 86.4349479675293
