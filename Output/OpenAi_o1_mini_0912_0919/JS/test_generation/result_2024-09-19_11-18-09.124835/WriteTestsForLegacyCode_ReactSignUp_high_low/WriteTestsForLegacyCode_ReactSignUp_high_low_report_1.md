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
// __tests__/form.test.js
import React from 'react';
import { shallow } from 'enzyme';
import { FormGroup } from '../components/form';
import { Input } from 'react-bootstrap';

describe('FormGroup Component', () => {
  it('renders children correctly', () => {
    const field = { touched: false, error: null };
    const wrapper = shallow(
      <FormGroup field={field}>
        <input type="text" />
      </FormGroup>
    );
    expect(wrapper.contains(<input type="text" />)).toBe(true);
  });

  it('applies bsStyle "error" when field is touched and has error', () => {
    const field = { touched: true, error: 'Error message' };
    const wrapper = shallow(
      <FormGroup field={field}>
        <input type="text" />
      </FormGroup>
    );
    expect(wrapper.find(Input).prop('bsStyle')).toBe('error');
    expect(wrapper.find('.help-block').text()).toBe('Error message');
  });

  it('applies bsStyle "success" when field is touched and has no error', () => {
    const field = { touched: true, error: null };
    const wrapper = shallow(
      <FormGroup field={field}>
        <input type="text" />
      </FormGroup>
    );
    expect(wrapper.find(Input).prop('bsStyle')).toBe('success');
    expect(wrapper.find('.help-block').exists()).toBe(false);
  });

  it('does not set bsStyle when field is not touched', () => {
    const field = { touched: false, error: null };
    const wrapper = shallow(
      <FormGroup field={field}>
        <input type="text" />
      </FormGroup>
    );
    expect(wrapper.find(Input).prop('bsStyle')).toBeUndefined();
    expect(wrapper.find('.help-block').exists()).toBe(false);
  });

  it('sets hasFeedback based on field.touched', () => {
    const fieldTouched = { touched: true, error: null };
    const fieldNotTouched = { touched: false, error: null };
    const wrapperTouched = shallow(
      <FormGroup field={fieldTouched}>
        <input type="text" />
      </FormGroup>
    );
    const wrapperNotTouched = shallow(
      <FormGroup field={fieldNotTouched}>
        <input type="text" />
      </FormGroup>
    );
    expect(wrapperTouched.find(Input).prop('hasFeedback')).toBe(true);
    expect(wrapperNotTouched.find(Input).prop('hasFeedback')).toBe(false);
  });
});
```

```javascript
// __tests__/signup.test.js
import React from 'react';
import { shallow, mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { Signup } from '../containers/signup';
import * as api from '../api';
import thunk from 'redux-thunk';

jest.mock('../api');

const mockStore = configureStore([thunk]);

describe('Signup Component', () => {
  let store;
  let props;

  beforeEach(() => {
    store = mockStore({});
    props = {
      fields: {
        name: { value: '', touched: false, error: null, onChange: jest.fn() },
        email: { value: '', touched: false, error: null, onChange: jest.fn() },
        password: { value: '', touched: false, error: null, onChange: jest.fn() },
      },
      handleSubmit: jest.fn(fn => fn),
      submitting: false,
      asyncValidating: false,
      dispatch: jest.fn(),
    };
  });

  it('renders correctly', () => {
    const wrapper = shallow(<Signup {...props} />);
    expect(wrapper.find('h2').text()).toBe('Join PodBaby today.');
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('Button').text()).toContain('Signup');
  });

  it('validates input correctly', () => {
    const { validate } = require('../containers/signup');
    const errors = validate({ name: 'Jo', email: 'invalid', password: '123' });
    expect(errors).toEqual({
      name: 'Name must be between 3 and 60 characters in length',
      email: 'A valid email address is required',
      password: 'Password must be at least 6 characters',
    });
  });

  it('performs async validation correctly', async () => {
    api.isEmail.mockResolvedValue({ data: false });
    api.isName.mockResolvedValue({ data: false });
    const { asyncValidate } = require('../containers/signup');
    const errors = await asyncValidate({ name: 'username', email: 'email@example.com' });
    expect(errors).toEqual({});
  });

  it('handles async validation errors', async () => {
    api.isEmail.mockResolvedValue({ data: true });
    api.isName.mockResolvedValue({ data: true });
    const { asyncValidate } = require('../containers/signup');
    const errors = await asyncValidate({ name: 'username', email: 'email@example.com' });
    expect(errors).toEqual({
      email: 'This email is already in use',
      name: 'This name is already in use',
    });
  });

  it('submits form successfully', async () => {
    const mockData = { user: 'test' };
    api.signup.mockResolvedValue({ data: mockData });
    const wrapper = shallow(<Signup {...props} />);
    const instance = wrapper.instance();
    instance.actions.signupComplete = jest.fn();
    await instance.handleSubmit({ name: 'test', email: 'test@example.com', password: 'password' });
    expect(api.signup).toHaveBeenCalledWith('test', 'test@example.com', 'password');
    expect(instance.actions.signupComplete).toHaveBeenCalledWith(mockData);
  });

  it('handles submission errors', async () => {
    const mockError = { data: 'Submission error' };
    api.signup.mockRejectedValue(mockError);
    const wrapper = shallow(<Signup {...props} />);
    const instance = wrapper.instance();
    await expect(instance.handleSubmit({ name: 'test', email: 'test@example.com', password: 'password' }))
      .rejects.toEqual('Submission error');
  });

  it('disables submit button when submitting', () => {
    const submittingProps = { ...props, submitting: true };
    const wrapper = shallow(<Signup {...submittingProps} />);
    expect(wrapper.find('Button').prop('disabled')).toBe(true);
  });

  it('enables submit button when not submitting', () => {
    const wrapper = shallow(<Signup {...props} />);
    expect(wrapper.find('Button').prop('disabled')).toBe(false);
  });
});
```

```javascript
// setupTests.js
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });
```

```json
// package.json (relevant parts)
{
  "scripts": {
    "test": "jest"
  },
  "jest": {
    "setupFilesAfterEnv": ["<rootDir>/setupTests.js"],
    "moduleNameMapper": {
      "\\.(css|less)$": "identity-obj-proxy"
    }
  },
  "devDependencies": {
    "enzyme": "^3.11.0",
    "enzyme-adapter-react-16": "^1.15.6",
    "identity-obj-proxy": "^3.0.0",
    "jest": "^26.6.3",
    "redux-mock-store": "^1.5.4",
    "babel-jest": "^26.6.3"
  }
}
```

```javascript
// babel.config.js
module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
};
```

```javascript
// __mocks__/react-bootstrap.js
import React from 'react';

export const Input = ({ children }) => <div>{children}</div>;
export const Button = ({ children, ...props }) => <button {...props}>{children}</button>;
```

```javascript
// __mocks__/react-router.js
import React from 'react';

export const Link = ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>;
```

```javascript
// __mocks__/react-document-title.js
import React from 'react';

const DocumentTitle = ({ children }) => <div>{children}</div>;

export default DocumentTitle;
```

```javascript
// __mocks__/redux-form.js
import React from 'react';
import { connect } from 'react-redux';

const mockReduxForm = (config) => (Component) => {
  const WrappedComponent = (props) => <Component {...props} />;
  return connect()(WrappedComponent);
};

export const reduxForm = mockReduxForm;
export const Field = ({ component, ...props }) => React.createElement(component, props);
```

```javascript
// __mocks__/../api/index.js
export const isName = jest.fn();
export const isEmail = jest.fn();
export const signup = jest.fn();
```

```javascript
// __mocks__/../actions/index.js
export const auth = {
  signupComplete: jest.fn(),
};
```

### Tokens: {'input_tokens': 1259, 'output_tokens': 2364, 'reasoning_tokens': 384}
### Execution time: 60.82433319091797
