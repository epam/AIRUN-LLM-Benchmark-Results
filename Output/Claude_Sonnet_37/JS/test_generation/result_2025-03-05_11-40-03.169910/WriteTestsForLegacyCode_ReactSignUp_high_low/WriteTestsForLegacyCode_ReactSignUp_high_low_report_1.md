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
# Test Setup

First, let's create the test files for the components:

**signup.test.js**
```jsx
import React from 'react';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Signup } from './signup';
import * as api from '../api';
import { validate, asyncValidate } from './signup';

// Mock dependencies
jest.mock('../api', () => ({
  signup: jest.fn(),
  isName: jest.fn(),
  isEmail: jest.fn(),
}));

jest.mock('../components/icon', () => () => <span>Icon</span>);
jest.mock('react-document-title', () => props => <div>{props.children}</div>);
jest.mock('react-router', () => ({
  Link: props => <a href={props.to}>{props.children}</a>,
}));

const mockStore = configureStore([thunk]);

describe('Signup Component', () => {
  let props;
  let store;
  
  beforeEach(() => {
    store = mockStore({});
    props = {
      fields: {
        name: { value: '', touched: false, error: null },
        email: { value: '', touched: false, error: null },
        password: { value: '', touched: false, error: null },
      },
      handleSubmit: fn => fn,
      submitting: false,
      asyncValidating: false,
      dispatch: jest.fn(),
    };
  });

  it('renders without crashing', () => {
    const wrapper = shallow(<Signup {...props} />);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders form elements correctly', () => {
    const wrapper = shallow(<Signup {...props} />);
    expect(wrapper.find('form')).toHaveLength(1);
    expect(wrapper.find('FormGroup')).toHaveLength(3);
    expect(wrapper.find('Button')).toHaveLength(1);
    expect(wrapper.find('Link')).toHaveLength(1);
  });

  it('binds action creators in constructor', () => {
    const wrapper = shallow(<Signup {...props} />);
    expect(props.dispatch).toHaveBeenCalled();
  });

  it('handles form submission successfully', async () => {
    const wrapper = shallow(<Signup {...props} />);
    const instance = wrapper.instance();
    
    api.signup.mockResolvedValue({ data: { token: 'test-token' } });
    
    const mockActions = { signupComplete: jest.fn() };
    instance.actions = mockActions;
    
    const values = { name: 'testuser', email: 'test@example.com', password: 'password123' };
    
    await instance.handleSubmit(values);
    
    expect(api.signup).toHaveBeenCalledWith('testuser', 'test@example.com', 'password123');
    expect(mockActions.signupComplete).toHaveBeenCalledWith({ token: 'test-token' });
  });

  it('handles form submission failure', async () => {
    const wrapper = shallow(<Signup {...props} />);
    const instance = wrapper.instance();
    
    api.signup.mockRejectedValue({ data: 'Error message' });
    
    const values = { name: 'testuser', email: 'test@example.com', password: 'password123' };
    
    try {
      await instance.handleSubmit(values);
    } catch (error) {
      expect(error).toBe('Error message');
    }
    
    expect(api.signup).toHaveBeenCalledWith('testuser', 'test@example.com', 'password123');
  });
});

describe('Signup Form Validation', () => {
  it('validates name field', () => {
    // Empty name
    let errors = validate({ name: '', email: 'test@example.com', password: 'password123' });
    expect(errors.name).toBeTruthy();
    
    // Name too short
    errors = validate({ name: 'ab', email: 'test@example.com', password: 'password123' });
    expect(errors.name).toBeTruthy();
    
    // Name too long
    const longName = 'a'.repeat(61);
    errors = validate({ name: longName, email: 'test@example.com', password: 'password123' });
    expect(errors.name).toBeTruthy();
    
    // Valid name
    errors = validate({ name: 'testuser', email: 'test@example.com', password: 'password123' });
    expect(errors.name).toBeFalsy();
  });

  it('validates email field', () => {
    // Empty email
    let errors = validate({ name: 'testuser', email: '', password: 'password123' });
    expect(errors.email).toBeTruthy();
    
    // Invalid email
    errors = validate({ name: 'testuser', email: 'invalid-email', password: 'password123' });
    expect(errors.email).toBeTruthy();
    
    // Valid email
    errors = validate({ name: 'testuser', email: 'test@example.com', password: 'password123' });
    expect(errors.email).toBeFalsy();
  });

  it('validates password field', () => {
    // Empty password
    let errors = validate({ name: 'testuser', email: 'test@example.com', password: '' });
    expect(errors.password).toBeTruthy();
    
    // Password too short
    errors = validate({ name: 'testuser', email: 'test@example.com', password: 'pass' });
    expect(errors.password).toBeTruthy();
    
    // Valid password
    errors = validate({ name: 'testuser', email: 'test@example.com', password: 'password123' });
    expect(errors.password).toBeFalsy();
  });
});

describe('Signup Async Validation', () => {
  beforeEach(() => {
    api.isName.mockReset();
    api.isEmail.mockReset();
  });

  it('checks if name is already in use', async () => {
    api.isName.mockResolvedValue({ data: true });
    api.isEmail.mockResolvedValue({ data: false });
    
    const errors = await asyncValidate({ name: 'existinguser', email: 'test@example.com' });
    
    expect(api.isName).toHaveBeenCalledWith('existinguser');
    expect(errors.name).toBe('This name is already in use');
  });

  it('checks if email is already in use', async () => {
    api.isName.mockResolvedValue({ data: false });
    api.isEmail.mockResolvedValue({ data: true });
    
    const errors = await asyncValidate({ name: 'testuser', email: 'existing@example.com' });
    
    expect(api.isEmail).toHaveBeenCalledWith('existing@example.com');
    expect(errors.email).toBe('This email is already in use');
  });

  it('returns no errors for valid name and email', async () => {
    api.isName.mockResolvedValue({ data: false });
    api.isEmail.mockResolvedValue({ data: false });
    
    const errors = await asyncValidate({ name: 'testuser', email: 'test@example.com' });
    
    expect(Object.keys(errors).length).toBe(0);
  });

  it('skips validation for empty fields', async () => {
    const errors = await asyncValidate({ name: '', email: '' });
    
    expect(api.isName).not.toHaveBeenCalled();
    expect(api.isEmail).not.toHaveBeenCalled();
  });
});
```

**form.test.js**
```jsx
import React from 'react';
import { shallow } from 'enzyme';
import { FormGroup } from './form';

describe('FormGroup Component', () => {
  it('renders without crashing', () => {
    const field = { touched: false, error: null };
    const wrapper = shallow(
      <FormGroup field={field}>
        <input type="text" />
      </FormGroup>
    );
    expect(wrapper.exists()).toBe(true);
  });

  it('renders children correctly', () => {
    const field = { touched: false, error: null };
    const wrapper = shallow(
      <FormGroup field={field}>
        <input type="text" />
      </FormGroup>
    );
    expect(wrapper.find('input')).toHaveLength(1);
  });

  it('shows no feedback when field is not touched', () => {
    const field = { touched: false, error: null };
    const wrapper = shallow(
      <FormGroup field={field}>
        <input type="text" />
      </FormGroup>
    );
    expect(wrapper.prop('hasFeedback')).toBe(false);
    expect(wrapper.prop('bsStyle')).toBeUndefined();
  });

  it('shows success feedback when field is touched and has no error', () => {
    const field = { touched: true, error: null };
    const wrapper = shallow(
      <FormGroup field={field}>
        <input type="text" />
      </FormGroup>
    );
    expect(wrapper.prop('hasFeedback')).toBe(true);
    expect(wrapper.prop('bsStyle')).toBe('success');
  });

  it('shows error feedback when field is touched and has error', () => {
    const field = { touched: true, error: 'This field is required' };
    const wrapper = shallow(
      <FormGroup field={field}>
        <input type="text" />
      </FormGroup>
    );
    expect(wrapper.prop('hasFeedback')).toBe(true);
    expect(wrapper.prop('bsStyle')).toBe('error');
  });

  it('displays error message when field is touched and has error', () => {
    const field = { touched: true, error: 'This field is required' };
    const wrapper = shallow(
      <FormGroup field={field}>
        <input type="text" />
      </FormGroup>
    );
    expect(wrapper.find('.help-block')).toHaveLength(1);
    expect(wrapper.find('.help-block').text()).toBe('This field is required');
  });

  it('does not display error message when field is not touched', () => {
    const field = { touched: false, error: 'This field is required' };
    const wrapper = shallow(
      <FormGroup field={field}>
        <input type="text" />
      </FormGroup>
    );
    expect(wrapper.find('.help-block')).toHaveLength(0);
  });

  it('does not display error message when field has no error', () => {
    const field = { touched: true, error: null };
    const wrapper = shallow(
      <FormGroup field={field}>
        <input type="text" />
      </FormGroup>
    );
    expect(wrapper.find('.help-block')).toHaveLength(0);
  });
});
```

**jest.config.js**
```js
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/setupTests.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

**setupTests.js**
```js
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
```

**package.json** (test-related dependencies)
```json
{
  "devDependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^14.4.3",
    "enzyme": "^3.11.0",
    "enzyme-adapter-react-16": "^1.15.7",
    "jest": "^29.5.0",
    "jest-environment-jsdom": "^29.5.0",
    "redux-mock-store": "^1.5.4",
    "identity-obj-proxy": "^3.0.0"
  },
  "scripts": {
    "test": "jest",
    "test:coverage": "jest --coverage"
  }
}
```

### Tokens: {'input_tokens': 1527, 'output_tokens': 3299}
### Execution time: 38.80339002609253
