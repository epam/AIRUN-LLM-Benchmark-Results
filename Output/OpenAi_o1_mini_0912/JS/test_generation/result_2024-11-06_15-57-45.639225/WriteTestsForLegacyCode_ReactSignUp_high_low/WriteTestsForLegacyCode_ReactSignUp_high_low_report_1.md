Your task is to write unit-tests for a legacy part of frontend application.

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
// form.test.js
import React from 'react';
import { shallow } from 'enzyme';
import { FormGroup } from './form';
import { Input } from 'react-bootstrap';

describe('FormGroup Component', () => {
  const renderComponent = (fieldProps, children = <div />) =>
    shallow(
      <FormGroup field={fieldProps}>
        {children}
      </FormGroup>
    );

  it('renders Input without feedback when field is not touched', () => {
    const field = { touched: false };
    const wrapper = renderComponent(field);
    const input = wrapper.find(Input);
    expect(input.prop('hasFeedback')).toBe(false);
    expect(input.prop('bsStyle')).toBeUndefined();
    expect(wrapper.find('.help-block').exists()).toBe(false);
  });

  it('renders Input with success when field is touched and no error', () => {
    const field = { touched: true, error: null };
    const wrapper = renderComponent(field);
    const input = wrapper.find(Input);
    expect(input.prop('hasFeedback')).toBe(true);
    expect(input.prop('bsStyle')).toBe('success');
    expect(wrapper.find('.help-block').exists()).toBe(false);
  });

  it('renders Input with error when field is touched and has error', () => {
    const field = { touched: true, error: 'Error message' };
    const wrapper = renderComponent(field);
    const input = wrapper.find(Input);
    expect(input.prop('hasFeedback')).toBe(true);
    expect(input.prop('bsStyle')).toBe('error');
    const helpBlock = wrapper.find('.help-block');
    expect(helpBlock.exists()).toBe(true);
    expect(helpBlock.text()).toBe('Error message');
  });

  it('renders children correctly', () => {
    const field = { touched: false };
    const child = <span className="child">Child Content</span>;
    const wrapper = renderComponent(field, child);
    expect(wrapper.contains(child)).toBe(true);
  });
});
```

```javascript
// signup.test.js
import React from 'react';
import { shallow, mount } from 'enzyme';
import { Signup } from './signup';
import { FormGroup } from '../components/form';
import { Button } from 'react-bootstrap';
import Icon from '../components/icon';
import DocumentTitle from 'react-document-title';
import * as api from '../api';
import { auth } from '../actions';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

jest.mock('../api');
jest.mock('../actions');

describe('Signup Component', () => {
  let props;
  let wrapper;
  const mockDispatch = jest.fn();
  const mockActions = {
    signupComplete: jest.fn(),
  };

  beforeEach(() => {
    auth.signupComplete = mockActions.signupComplete;

    props = {
      fields: {
        name: { touched: false, error: null, onChange: jest.fn(), onBlur: jest.fn() },
        email: { touched: false, error: null, onChange: jest.fn(), onBlur: jest.fn() },
        password: { touched: false, error: null, onChange: jest.fn(), onBlur: jest.fn() },
      },
      handleSubmit: jest.fn(fn => fn),
      submitting: false,
      asyncValidating: false,
      dispatch: mockDispatch,
    };

    wrapper = shallow(<Signup {...props} />);
  });

  it('renders without crashing', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('renders DocumentTitle with correct title', () => {
    const docTitle = wrapper.find(DocumentTitle);
    expect(docTitle.prop('title')).toBe('Signup');
    expect(docTitle.contains(<h2>Join PodBaby today.</h2>)).toBe(true);
  });

  it('renders form fields correctly', () => {
    expect(wrapper.find(FormGroup).length).toBe(3);
    expect(wrapper.find('input[type="text"]').length).toBe(1);
    expect(wrapper.find('input[type="email"]').length).toBe(1);
    expect(wrapper.find('input[type="password"]').length).toBe(1);
    expect(wrapper.find(Button).length).toBe(1);
  });

  it('calls handleSubmit on form submission', () => {
    const mockHandleSubmit = jest.fn();
    props.handleSubmit = mockHandleSubmit;
    wrapper = shallow(<Signup {...props} />);

    const form = wrapper.find('form');
    form.simulate('submit', { preventDefault: jest.fn() });

    expect(props.handleSubmit).toHaveBeenCalled();
  });

  it('disables the submit button when submitting', () => {
    props.submitting = true;
    wrapper = shallow(<Signup {...props} />);
    const button = wrapper.find(Button);
    expect(button.prop('disabled')).toBe(true);
  });

  describe('handleSubmit', () => {
    it('calls api.signup and dispatches signupComplete on success', async () => {
      const instance = wrapper.instance();
      const values = { name: 'John Doe', email: 'john@example.com', password: 'password' };
      const result = { data: { user: 'user data' } };
      api.signup.mockResolvedValue(result);

      instance.actions.signupComplete = mockActions.signupComplete;

      const promise = instance.handleSubmit(values);
      await promise;

      expect(api.signup).toHaveBeenCalledWith('John Doe', 'john@example.com', 'password');
      expect(mockActions.signupComplete).toHaveBeenCalledWith(result.data);
    });

    it('rejects with error data on api.signup failure', async () => {
      const instance = wrapper.instance();
      const values = { name: 'John Doe', email: 'john@example.com', password: 'password' };
      const error = { data: 'Signup failed' };
      api.signup.mockRejectedValue(error);

      try {
        await instance.handleSubmit(values);
      } catch (err) {
        expect(err).toBe('Signup failed');
      }

      expect(api.signup).toHaveBeenCalledWith('John Doe', 'john@example.com', 'password');
    });
  });

  describe('validate function', () => {
    const { validate } = require('./signup'); // Assuming validate is exported for testing

    it('returns error when name is missing', () => {
      const values = { email: 'john@example.com', password: 'password' };
      const errors = validate(values);
      expect(errors.name).toBe('Name must be between 3 and 60 characters in length');
    });

    it('returns error when name is too short', () => {
      const values = { name: 'Jo', email: 'john@example.com', password: 'password' };
      const errors = validate(values);
      expect(errors.name).toBe('Name must be between 3 and 60 characters in length');
    });

    it('returns error when email is invalid', () => {
      const values = { name: 'John Doe', email: 'invalid-email', password: 'password' };
      const errors = validate(values);
      expect(errors.email).toBe('A valid email address is required');
    });

    it('returns error when password is too short', () => {
      const values = { name: 'John Doe', email: 'john@example.com', password: '123' };
      const errors = validate(values);
      expect(errors.password).toBe('Password must be at least 6 characters');
    });

    it('returns no errors for valid input', () => {
      const values = { name: 'John Doe', email: 'john@example.com', password: 'password' };
      const errors = validate(values);
      expect(errors).toEqual({});
    });
  });

  describe('asyncValidate function', () => {
    const { asyncValidate } = require('./signup'); // Assuming asyncValidate is exported for testing

    it('returns error when name is already in use', async () => {
      api.isName.mockResolvedValue({ data: true });
      api.isEmail.mockResolvedValue({ data: false });

      const values = { name: 'ExistingName', email: 'new@example.com' };
      const errors = await asyncValidate(values);
      expect(api.isName).toHaveBeenCalledWith('ExistingName');
      expect(api.isEmail).toHaveBeenCalledWith('new@example.com');
      expect(errors).toEqual({ name: 'This name is already in use' });
    });

    it('returns error when email is already in use', async () => {
      api.isName.mockResolvedValue({ data: false });
      api.isEmail.mockResolvedValue({ data: true });

      const values = { name: 'NewName', email: 'existing@example.com' };
      const errors = await asyncValidate(values);
      expect(api.isName).toHaveBeenCalledWith('NewName');
      expect(api.isEmail).toHaveBeenCalledWith('existing@example.com');
      expect(errors).toEqual({ email: 'This email is already in use' });
    });

    it('returns both errors when name and email are in use', async () => {
      api.isName.mockResolvedValue({ data: true });
      api.isEmail.mockResolvedValue({ data: true });

      const values = { name: 'ExistingName', email: 'existing@example.com' };
      const errors = await asyncValidate(values);
      expect(errors).toEqual({
        name: 'This name is already in use',
        email: 'This email is already in use',
      });
    });

    it('returns no errors when name and email are available', async () => {
      api.isName.mockResolvedValue({ data: false });
      api.isEmail.mockResolvedValue({ data: false });

      const values = { name: 'NewName', email: 'new@example.com' };
      const errors = await asyncValidate(values);
      expect(errors).toEqual({});
    });
  });
});
```

### Tokens: {'input_tokens': 1259, 'output_tokens': 5291, 'reasoning_tokens': 3200}
### Execution time: 25.721681118011475
