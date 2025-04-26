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
Okay, let's set up the testing environment and write comprehensive unit tests for the provided React components and validation logic.

We will use:
*   **Jest:** As the test runner.
*   **@testing-library/react:** For rendering components and interacting with them in a way that mimics user behavior. This is the recommended library for testing React components.
*   **Jest's built-in mocking:** For mocking API calls and other dependencies.
*   **Mocking `redux-form`:** Since `redux-form` is a Higher-Order Component (HOC), we'll mock it to test the wrapped `Signup` component in isolation, providing the props that `redux-form` would normally inject.
*   **Testing validation functions directly:** The `validate` and `asyncValidate` functions are pure (or near-pure) and can be tested independently.

**1. Setup Testing Environment**

First, ensure you have the necessary dependencies installed. Assuming you have a standard React project setup with Jest:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
# If you need babel for JSX/ESM in tests (common in React projects)
# npm install --save-dev @babel/preset-env @babel/preset-react babel-jest
```

Make sure your Jest configuration (usually in `package.json` or `jest.config.js`) is set up correctly to handle JSX and ES modules if needed. `@testing-library/jest-dom` provides custom matchers for DOM elements, which are very useful.

**2. Mocking Dependencies**

We need to mock:
*   `../api`: For `isName`, `isEmail`, and `signup`.
*   `../actions`: For `auth.signupComplete`.
*   `redux-form`: To test the `Signup` component class directly.
*   `react-router`: For the `Link` component (though we'll just ensure it renders, not test navigation).
*   `react-document-title`: Can be mocked to simplify the test output.
*   `react-bootstrap`: For `Button` and `Input` (used by `FormGroup`). We can mock these or rely on their basic rendering if we don't need to test their specific behavior. Mocking might be safer.
*   `../components/icon`: Mock the `Icon` component.
*   `../utils`: For `getTitle`.

Let's create mock files or use `jest.mock` directly in the test files.

**3. Writing Tests**

We'll create two test files:
*   `form.test.js`: For the `FormGroup` component.
*   `signup.test.js`: For the `Signup` component, `validate`, and `asyncValidate`.

---

**`src/components/form.test.js`**

```javascript
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Input } from 'react-bootstrap'; // Assuming react-bootstrap is installed

// Mock react-bootstrap Input to simplify testing
jest.mock('react-bootstrap', () => ({
  Input: jest.fn(({ children, ...props }) => (
    <div data-testid="mock-input" {...props}>
      {children}
    </div>
  )),
}));

import { FormGroup } from './form';

describe('FormGroup', () => {
  const mockField = {
    touched: false,
    error: undefined,
    name: 'testField',
    value: '',
    onChange: jest.fn(),
    onBlur: jest.fn(),
    onFocus: jest.fn(),
  };

  const ChildComponent = () => <input data-testid="child-input" />;

  it('renders children correctly', () => {
    render(
      <FormGroup field={mockField}>
        <ChildComponent />
      </FormGroup>
    );
    expect(screen.getByTestId('child-input')).toBeInTheDocument();
  });

  it('renders Input with default props when not touched', () => {
    render(
      <FormGroup field={mockField}>
        <ChildComponent />
      </FormGroup>
    );
    const mockInput = screen.getByTestId('mock-input');
    expect(mockInput).toHaveAttribute('hasFeedback', 'false'); // hasFeedback is boolean, but rendered as string
    expect(mockInput).not.toHaveAttribute('bsStyle');
    expect(screen.queryByText('help-block')).not.toBeInTheDocument();
  });

  it('renders Input with success style when touched and no error', () => {
    const touchedField = { ...mockField, touched: true, error: undefined };
    render(
      <FormGroup field={touchedField}>
        <ChildComponent />
      </FormGroup>
    );
    const mockInput = screen.getByTestId('mock-input');
    expect(mockInput).toHaveAttribute('hasFeedback', 'true');
    expect(mockInput).toHaveAttribute('bsStyle', 'success');
    expect(screen.queryByText('help-block')).not.toBeInTheDocument();
  });

  it('renders Input with error style and help text when touched and has error', () => {
    const errorField = { ...mockField, touched: true, error: 'This is an error' };
    render(
      <FormGroup field={errorField}>
        <ChildComponent />
      </FormGroup>
    );
    const mockInput = screen.getByTestId('mock-input');
    expect(mockInput).toHaveAttribute('hasFeedback', 'true');
    expect(mockInput).toHaveAttribute('bsStyle', 'error');
    expect(screen.getByText('This is an error')).toBeInTheDocument();
    expect(screen.getByText('This is an error')).toHaveClass('help-block');
  });
});
```

---

**`src/containers/signup.test.js`**

```javascript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'; // Or use a real mock store setup
import { MemoryRouter } from 'react-router-dom'; // Use react-router-dom v4/v5 Link
import { reduxForm } from 'redux-form';
import validator from 'validator'; // Need to mock if its methods are complex, but isEmail is simple

// Import the unconnected component and validation functions
import { Signup, validate, asyncValidate } from './signup';

// --- Mocks ---

// Mock API calls
const mockApi = {
  isName: jest.fn(),
  isEmail: jest.fn(),
  signup: jest.fn(),
};
jest.mock('../api', () => mockApi);

// Mock Redux actions
const mockAuthActions = {
  signupComplete: jest.fn(data => ({ type: 'SIGNUP_COMPLETE', payload: data })),
};
jest.mock('../actions', () => ({
  auth: mockAuthActions,
}));

// Mock react-router Link
jest.mock('react-router', () => ({
  Link: ({ to, children }) => <a href={to}>{children}</a>,
}));

// Mock react-document-title
jest.mock('react-document-title', () => ({ children }) => <title>{children}</title>);

// Mock react-bootstrap components used directly in Signup
jest.mock('react-bootstrap', () => ({
  Button: jest.fn(({ children, ...props }) => <button {...props}>{children}</button>),
}));

// Mock the Icon component
jest.mock('../components/icon', () => ({ icon }) => <i data-icon={icon} />);

// Mock the utils getTitle function
jest.mock('./utils', () => ({
  getTitle: jest.fn(title => `Mock Title - ${title}`),
}));

// Mock the FormGroup component (already tested separately)
jest.mock('../components/form', () => ({
  FormGroup: jest.fn(({ field, children }) => (
    <div data-testid={`form-group-${field.name}`}>
      {children}
      {field.touched && field.error && <span data-testid={`help-block-${field.name}`}>{field.error}</span>}
    </div>
  )),
}));


// Mock redux-form HOC
// This mock replaces the HOC and provides the necessary props to the wrapped component.
// It also captures the form configuration.
let mockReduxFormConfig = {};
jest.mock('redux-form', () => ({
  reduxForm: jest.fn(config => {
    mockReduxFormConfig = config; // Store the config for testing
    return WrappedComponent => {
      // Return a component that renders the WrappedComponent with mock props
      return function MockReduxForm(props) {
        // Provide mock props that redux-form would inject
        const mockFields = {};
        config.fields.forEach(fieldName => {
          mockFields[fieldName] = {
            name: fieldName,
            value: props[fieldName] || '', // Allow initial values if needed
            onChange: jest.fn(),
            onBlur: jest.fn(),
            onFocus: jest.fn(),
            touched: false, // Default state
            error: undefined, // Default state
          };
        });

        const mockSubmit = jest.fn(submitHandler => async (event) => {
            // Simulate redux-form's handleSubmit calling the component's onSubmit
            // We need to pass form values to the component's handler
            // For simplicity in this mock, we'll just call the handler with dummy values
            // In a real scenario, you might simulate field changes first
            const values = {}; // Simulate getting values from the form state
             config.fields.forEach(fieldName => {
                 values[fieldName] = mockFields[fieldName].value; // Use the value from mockFields
             });

            // Simulate validation if needed, but for testing the component's handleSubmit,
            // we assume validation passed and handleSubmit is called with values.
            // We'll test validation functions separately.

            // Call the component's onSubmit prop (which is handleSubmit(this.handleSubmit))
            // The component's onSubmit expects the values
            await submitHandler(values);
        });


        return (
          <WrappedComponent
            {...props}
            fields={mockFields}
            handleSubmit={mockSubmit} // Provide the mock handleSubmit prop
            submitting={false} // Default state
            asyncValidating={false} // Default state
            dispatch={jest.fn()} // Provide a mock dispatch
          />
        );
      };
    };
  }),
  // Export other necessary redux-form items if used directly (like reducer, etc.)
}));


// --- Tests ---

describe('Signup Validation', () => {
  describe('validate', () => {
    it('should return an empty object for valid input', () => {
      const values = {
        name: 'Valid Name',
        email: 'test@example.com',
        password: 'password123',
      };
      expect(validate(values)).toEqual({});
    });

    it('should return error for empty name', () => {
      const values = { name: '', email: 'test@example.com', password: 'password123' };
      expect(validate(values)).toEqual({ name: 'Name must be between 3 and 60 characters in length' });
    });

    it('should return error for name too short', () => {
      const values = { name: 'ab', email: 'test@example.com', password: 'password123' };
      expect(validate(values)).toEqual({ name: 'Name must be between 3 and 60 characters in length' });
    });

    it('should return error for name too long', () => {
      const values = { name: 'a'.repeat(61), email: 'test@example.com', password: 'password123' };
      expect(validate(values)).toEqual({ name: 'Name must be between 3 and 60 characters in length' });
    });

    it('should return error for empty email', () => {
      const values = { name: 'Valid Name', email: '', password: 'password123' };
      expect(validate(values)).toEqual({ email: 'A valid email address is required' });
    });

    it('should return error for invalid email format', () => {
      const values = { name: 'Valid Name', email: 'invalid-email', password: 'password123' };
      expect(validate(values)).toEqual({ email: 'A valid email address is required' });
    });

    it('should return error for empty password', () => {
      const values = { name: 'Valid Name', email: 'test@example.com', password: '' };
      expect(validate(values)).toEqual({ password: 'Password must be at least 6 characters' });
    });

    it('should return error for password too short', () => {
      const values = { name: 'Valid Name', email: 'test@example.com', password: 'short' };
      expect(validate(values)).toEqual({ password: 'Password must be at least 6 characters' });
    });

    it('should return multiple errors', () => {
      const values = { name: 'a', email: 'invalid', password: '123' };
      expect(validate(values)).toEqual({
        name: 'Name must be between 3 and 60 characters in length',
        email: 'A valid email address is required',
        password: 'Password must be at least 6 characters',
      });
    });
  });

  describe('asyncValidate', () => {
    beforeEach(() => {
      // Reset mocks before each asyncValidate test
      mockApi.isName.mockReset();
      mockApi.isEmail.mockReset();
    });

    it('should return empty object if name and email are available', async () => {
      mockApi.isName.mockResolvedValue({ data: false });
      mockApi.isEmail.mockResolvedValue({ data: false });

      const values = { name: 'Available Name', email: 'available@example.com' };
      const errors = await asyncValidate(values);

      expect(errors).toEqual({});
      expect(mockApi.isName).toHaveBeenCalledWith('Available Name');
      expect(mockApi.isEmail).toHaveBeenCalledWith('available@example.com');
    });

    it('should return error if name is already in use', async () => {
      mockApi.isName.mockResolvedValue({ data: true });
      mockApi.isEmail.mockResolvedValue({ data: false });

      const values = { name: 'Used Name', email: 'available@example.com' };
      const errors = await asyncValidate(values);

      expect(errors).toEqual({ name: 'This name is already in use' });
      expect(mockApi.isName).toHaveBeenCalledWith('Used Name');
      expect(mockApi.isEmail).toHaveBeenCalledWith('available@example.com');
    });

    it('should return error if email is already in use', async () => {
      mockApi.isName.mockResolvedValue({ data: false });
      mockApi.isEmail.mockResolvedValue({ data: true });

      const values = { name: 'Available Name', email: 'used@example.com' };
      const errors = await asyncValidate(values);

      expect(errors).toEqual({ email: 'This email is already in use' });
      expect(mockApi.isName).toHaveBeenCalledWith('Available Name');
      expect(mockApi.isEmail).toHaveBeenCalledWith('used@example.com');
    });

    it('should return errors if both name and email are in use', async () => {
      mockApi.isName.mockResolvedValue({ data: true });
      mockApi.isEmail.mockResolvedValue({ data: true });

      const values = { name: 'Used Name', email: 'used@example.com' };
      const errors = await asyncValidate(values);

      expect(errors).toEqual({
        name: 'This name is already in use',
        email: 'This email is already in use',
      });
      expect(mockApi.isName).toHaveBeenCalledWith('Used Name');
      expect(mockApi.isEmail).toHaveBeenCalledWith('used@example.com');
    });

    it('should not call API if name is empty', async () => {
      mockApi.isEmail.mockResolvedValue({ data: false }); // Email is present

      const values = { name: '', email: 'available@example.com' };
      const errors = await asyncValidate(values);

      expect(errors).toEqual({});
      expect(mockApi.isName).not.toHaveBeenCalled();
      expect(mockApi.isEmail).toHaveBeenCalledWith('available@example.com');
    });

    it('should not call API if email is empty', async () => {
      mockApi.isName.mockResolvedValue({ data: false }); // Name is present

      const values = { name: 'Available Name', email: '' };
      const errors = await asyncValidate(values);

      expect(errors).toEqual({});
      expect(mockApi.isName).toHaveBeenCalledWith('Available Name');
      expect(mockApi.isEmail).not.toHaveBeenCalled();
    });

     it('should return empty object if both name and email are empty', async () => {
      const values = { name: '', email: '' };
      const errors = await asyncValidate(values);

      expect(errors).toEqual({});
      expect(mockApi.isName).not.toHaveBeenCalled();
      expect(mockApi.isEmail).not.toHaveBeenCalled();
    });
  });
});


// Test the unconnected Signup component class
describe('Signup Component (unconnected)', () => {
  // We need to provide the props that reduxForm would inject
  const mockReduxFormProps = {
    fields: {
      name: { name: 'name', value: '', onChange: jest.fn(), onBlur: jest.fn(), onFocus: jest.fn(), touched: false, error: undefined },
      email: { name: 'email', value: '', onChange: jest.fn(), onBlur: jest.fn(), onFocus: jest.fn(), touched: false, error: undefined },
      password: { name: 'password', value: '', onChange: jest.fn(), onBlur: jest.fn(), onFocus: jest.fn(), touched: false, error: undefined },
    },
    handleSubmit: jest.fn(), // This mock will be called by fireEvent.submit
    submitting: false,
    asyncValidating: false,
    dispatch: jest.fn(), // Mock dispatch for bindActionCreators
  };

  beforeEach(() => {
    // Clear mocks before each component test
    jest.clearAllMocks();
    // Reset mockReduxFormProps touched/error state for isolation
     Object.keys(mockReduxFormProps.fields).forEach(fieldName => {
        mockReduxFormProps.fields[fieldName].touched = false;
        mockReduxFormProps.fields[fieldName].error = undefined;
     });
     mockReduxFormProps.submitting = false;
  });

  it('renders the signup form correctly', () => {
    render(<Signup {...mockReduxFormProps} />);

    expect(screen.getByText('Join PodBaby today.')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Signup/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Already a member\? Log in here\./i })).toHaveAttribute('href', '/login/');
    expect(screen.getByText('As a member you can subscribe to podcast feeds and keep track of your favorite episodes.')).toBeInTheDocument();

    // Check if FormGroup is used for each field
    expect(screen.getByTestId('form-group-name')).toBeInTheDocument();
    expect(screen.getByTestId('form-group-email')).toBeInTheDocument();
    expect(screen.getByTestId('form-group-password')).toBeInTheDocument();

    // Check DocumentTitle mock
    expect(getTitle).toHaveBeenCalledWith('Signup');
    // Note: Testing the actual <title> tag requires a different setup or relying on the mock
  });

  it('disables the submit button when submitting prop is true', () => {
    const submittingProps = { ...mockReduxFormProps, submitting: true };
    render(<Signup {...submittingProps} />);

    const submitButton = screen.getByRole('button', { name: /Signup/i });
    expect(submitButton).toBeDisabled();
  });

  it('enables the submit button when submitting prop is false', () => {
    const submittingProps = { ...mockReduxFormProps, submitting: false };
    render(<Signup {...submittingProps} />);

    const submitButton = screen.getByRole('button', { name: /Signup/i });
    expect(submitButton).toBeEnabled();
  });

  it('calls the handleSubmit prop when the form is submitted', () => {
    render(<Signup {...mockReduxFormProps} />);

    const form = screen.getByRole('form'); // Assuming the form has role="form" or find by tag 'form'
    fireEvent.submit(form);

    // The mock handleSubmit prop should be called
    expect(mockReduxFormProps.handleSubmit).toHaveBeenCalledTimes(1);
    // The mock handleSubmit prop is expected to return the component's onSubmit handler
    // We can't easily check the argument passed to the *inner* handler here without
    // a more sophisticated mock of reduxForm's handleSubmit.
    // However, we can test the component's own handleSubmit method directly.
  });

  describe('component instance handleSubmit method', () => {
    const mockValues = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };
    const mockSuccessResult = { id: 1, token: 'fake-token' };

    // To test the instance method, we need to get a reference to the instance.
    // With @testing-library/react, the recommended way is often to test the behavior
    // triggered by user interaction. However, directly testing the method is also valid
    // for complex logic like this. We can create an instance manually for this.

    let signupInstance;
    let mockDispatch;

    beforeEach(() => {
        // Create a fresh instance for each test
        mockDispatch = jest.fn();
        // Manually create an instance, providing necessary props
        signupInstance = new Signup({
            ...mockReduxFormProps, // Include props like fields, handleSubmit (though not used by the method itself)
            dispatch: mockDispatch, // Provide the mock dispatch
        });
        // Manually call constructor to set up actions
        signupInstance.constructor({ dispatch: mockDispatch });

        // Reset API and action mocks
        mockApi.signup.mockReset();
        mockAuthActions.signupComplete.mockReset();
    });


    it('calls api.signup and dispatches signupComplete on success', async () => {
      mockApi.signup.mockResolvedValue({ data: mockSuccessResult });

      // Call the instance method directly
      await signupInstance.handleSubmit(mockValues);

      expect(mockApi.signup).toHaveBeenCalledWith(
        mockValues.name,
        mockValues.email,
        mockValues.password
      );
      // Check if signupComplete action creator was called with the result data
      expect(mockAuthActions.signupComplete).toHaveBeenCalledWith(mockSuccessResult);
      // Check if dispatch was called with the action created by signupComplete
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'SIGNUP_COMPLETE', payload: mockSuccessResult });
    });

    it('rejects the promise with error data on API failure', async () => {
      const mockErrorData = { message: 'Signup failed' };
      mockApi.signup.mockRejectedValue({ data: mockErrorData });

      await expect(signupInstance.handleSubmit(mockValues)).rejects.toEqual(mockErrorData);

      expect(mockApi.signup).toHaveBeenCalledWith(
        mockValues.name,
        mockValues.email,
        mockValues.password
      );
      // Ensure signupComplete was NOT called on failure
      expect(mockAuthActions.signupComplete).not.toHaveBeenCalled();
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });
});


// Test the reduxForm configuration
describe('reduxForm configuration', () => {
    it('should be configured correctly', () => {
        // The mock reduxForm captures the config object
        expect(mockReduxFormConfig.form).toBe('signup');
        expect(mockReduxFormConfig.fields).toEqual(['name', 'email', 'password']);
        expect(mockReduxFormConfig.validate).toBe(validate); // Check if the correct validate function is used
        expect(mockReduxFormConfig.asyncValidate).toBe(asyncValidate); // Check if the correct asyncValidate function is used
        expect(mockReduxFormConfig.asyncBlurFields).toEqual(['name', 'email']);
    });
});
```

---

**Explanation:**

1.  **Setup:** We import necessary libraries and the components/functions to be tested.
2.  **Mocking:**
    *   We use `jest.mock` to replace external dependencies like `../api`, `../actions`, `react-router`, `react-document-title`, `react-bootstrap`, `../components/icon`, and `../utils`. This isolates the code under test.
    *   `redux-form` is mocked to provide a controlled environment for testing the `Signup` component class. The mock `reduxForm` HOC returns a function that renders the wrapped component (`Signup`) and injects mock props (`fields`, `handleSubmit`, `submitting`, `asyncValidating`, `dispatch`). It also stores the configuration object passed to `reduxForm` so we can test that separately.
    *   The mock `handleSubmit` prop provided by our mock `reduxForm` is a `jest.fn()`. When `fireEvent.submit` is called on the form, this mock function is triggered. In a real `redux-form` setup, this `handleSubmit` prop would handle validation and then call the component's `onSubmit` prop (which is `handleSubmit(this.handleSubmit.bind(this))`). Our mock simplifies this by assuming validation passes and focusing on ensuring the component's `handleSubmit` method is eventually called with values.
    *   `FormGroup` is also mocked because we test it separately. This prevents its internal logic from interfering with the `Signup` component tests and keeps the focus on `Signup`.
3.  **`FormGroup.test.js`:**
    *   Tests the `FormGroup` component in isolation.
    *   Mocks `react-bootstrap/Input` to control its behavior and check props passed to it.
    *   Uses `render` from `@testing-library/react` to render the component with different `field` prop states (`touched`, `error`).
    *   Uses `screen.getBy*` and `expect(...).toBeInTheDocument()` / `toHaveAttribute` / `toHaveClass` to assert the rendered output based on the `field` prop.
4.  **`signup.test.js`:**
    *   **Validation Tests:**
        *   Tests the `validate` function directly by calling it with various input value objects and asserting the returned errors object.
        *   Tests the `asyncValidate` function directly. It mocks `api.isName` and `api.isEmail` to control their return values (promises resolving with `{ data: true }` or `{ data: false }`). It uses `async/await` to handle the promise returned by `asyncValidate` and asserts the resulting errors object and that the correct API mocks were called.
    *   **Component Rendering Tests:**
        *   Tests the *unconnected* `Signup` component class.
        *   Uses `render` from `@testing-library/react`, passing mock props that mimic what `redux-form` would provide (`mockReduxFormProps`).
        *   Asserts the presence of key elements (headings, paragraphs, inputs, button, link) using `screen.getBy*`.
        *   Asserts the button's disabled state based on the `submitting` prop.
        *   Asserts that the mocked `FormGroup` and `Icon` components are used.
        *   Asserts that `getTitle` was called correctly.
    *   **Form Submission Interaction Test:**
        *   Renders the component.
        *   Uses `fireEvent.submit` on the form element.
        *   Asserts that the mock `handleSubmit` prop (provided by our mock `reduxForm`) was called.
    *   **Component `handleSubmit` Method Test:**
        *   This is crucial for testing the core logic triggered *after* `redux-form` handles validation and calls the component's `onSubmit`.
        *   Instead of simulating the full `redux-form` flow (which is complex with mocks), we directly create an instance of the `Signup` class in the test and call its `handleSubmit` method with mock values.
        *   We mock `api.signup` to control the API response (success or failure).
        *   We mock `dispatch` and `auth.signupComplete` to verify that the correct action is dispatched on success.
        *   We use `async/await` and `expect(...).rejects` to handle the promise returned by `handleSubmit` and test both success and failure paths.
    *   **Redux-Form Config Test:**
        *   Since our `redux-form` mock captures the configuration object, we add a test to verify that the `Signup` component was wrapped with the correct `redux-form` configuration (form name, fields, validation functions, async blur fields).

This setup provides good isolation. The validation functions are tested purely. The `FormGroup` is tested purely. The `Signup` component's rendering and its core `handleSubmit` logic are tested by providing mock props and calling the method directly or simulating events that trigger it via the mock props. The `redux-form` configuration itself is also verified.

To run the tests, use your standard Jest command, typically `npm test` or `yarn test`. Add the `--coverage` flag to check coverage: `npm test -- --coverage`. You should see high coverage for `signup.js` and `form.js`.

### Tokens: {'input_tokens': 1669, 'output_tokens': 6988}
### Execution time: 51.77678680419922
