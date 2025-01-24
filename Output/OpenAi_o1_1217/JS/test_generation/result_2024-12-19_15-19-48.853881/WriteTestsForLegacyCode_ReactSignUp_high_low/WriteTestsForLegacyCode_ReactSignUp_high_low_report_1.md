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
package.json:
{
  "name": "legacy-frontend-tests",
  "version": "1.0.0",
  "scripts": {
    "test": "jest --coverage"
  },
  "dependencies": {
    "react": "^15.6.2",
    "react-dom": "^15.6.2",
    "redux": "^3.7.2",
    "redux-form": "^6.8.0",
    "react-redux": "^5.0.6",
    "react-bootstrap": "^0.32.4",
    "validator": "^5.7.0"
  },
  "devDependencies": {
    "babel-cli": "^6.26.0",
    "babel-jest": "^23.6.0",
    "babel-preset-env": "^1.7.0",
    "babel-preset-react": "^6.24.1",
    "enzyme": "^2.9.1",
    "enzyme-adapter-react-15": "^1.0.6",
    "jest": "^23.6.0",
    "react-test-renderer": "^15.6.2",
    "sinon": "^9.2.4"
  }
}

.babelrc:
{
  "presets": [
    "env",
    "react"
  ]
}

jest.config.js:
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },
  moduleFileExtensions: ["js", "jsx"]
};

setupTests.js:
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

configure({ adapter: new Adapter() });

__mocks__/api.js:
export const isName = jest.fn();
export const isEmail = jest.fn();
export const signup = jest.fn();

__tests__/signup.test.js:
import React from 'react';
import { shallow } from 'enzyme';
import { Signup } from '../signup';
import * as api from '../api';

jest.mock('../api');

describe('Signup Component', () => {
  const defaultProps = {
    fields: {
      name: { touched: false, error: null },
      email: { touched: false, error: null },
      password: { touched: false, error: null }
    },
    handleSubmit: fn => fn,
    submitting: false,
    asyncValidating: false,
    dispatch: jest.fn()
  };

  beforeEach(() => {
    api.signup.mockClear();
  });

  it('renders without crashing', () => {
    const wrapper = shallow(<Signup {...defaultProps} />);
    expect(wrapper.exists()).toBe(true);
  });

  it('calls handleSubmit when form is submitted', () => {
    const wrapper = shallow(<Signup {...defaultProps} />);
    const instance = wrapper.instance();
    const spy = jest.spyOn(instance, 'handleSubmit');
    wrapper.update();
    wrapper.find('form').simulate('submit', { preventDefault() {} });
    expect(spy).toHaveBeenCalled();
  });

  it('handleSubmit calls api.signup on valid input', async () => {
    api.signup.mockResolvedValue({ data: { user: 'test' } });
    const wrapper = shallow(<Signup {...defaultProps} />);
    const instance = wrapper.instance();
    const values = { name: 'Test', email: 'test@test.com', password: '123456' };
    await instance.handleSubmit(values);
    expect(api.signup).toHaveBeenCalledWith('Test', 'test@test.com', '123456');
  });
});

__tests__/signup.validation.test.js:
import { validate, asyncValidate } from '../signup';
import * as api from '../api';

jest.mock('../api');

describe('Signup Validation', () => {
  describe('validate()', () => {
    it('returns error if name is missing', () => {
      const result = validate({ name: '', email: 'test@test.com', password: '123456' });
      expect(result.name).toBeDefined();
    });

    it('returns error if name is too short', () => {
      const result = validate({ name: 'ab', email: 'test@test.com', password: '123456' });
      expect(result.name).toBeDefined();
    });

    it('returns error if name is too long', () => {
      const longName = Array(62).join('a');
      const result = validate({ name: longName, email: 'test@test.com', password: '123456' });
      expect(result.name).toBeDefined();
    });

    it('returns error if email is invalid', () => {
      const result = validate({ name: 'Valid Name', email: 'invalid', password: '123456' });
      expect(result.email).toBeDefined();
    });

    it('returns error if password is too short', () => {
      const result = validate({ name: 'Valid Name', email: 'test@test.com', password: 'abc' });
      expect(result.password).toBeDefined();
    });

    it('returns no error for valid input', () => {
      const result = validate({ name: 'Valid Name', email: 'test@test.com', password: '123456' });
      expect(result).toEqual({});
    });
  });

  describe('asyncValidate()', () => {
    beforeEach(() => {
      api.isName.mockClear();
      api.isEmail.mockClear();
    });

    it('returns error if name is already in use', async () => {
      api.isName.mockResolvedValue({ data: true });
      api.isEmail.mockResolvedValue({ data: false });
      const values = { name: 'TakenName', email: 'test@test.com' };
      const errors = await asyncValidate(values);
      expect(errors.name).toBe('This name is already in use');
    });

    it('returns error if email is already in use', async () => {
      api.isName.mockResolvedValue({ data: false });
      api.isEmail.mockResolvedValue({ data: true });
      const values = { name: 'ValidName', email: 'test@test.com' };
      const errors = await asyncValidate(values);
      expect(errors.email).toBe('This email is already in use');
    });

    it('returns no errors if neither is in use', async () => {
      api.isName.mockResolvedValue({ data: false });
      api.isEmail.mockResolvedValue({ data: false });
      const values = { name: 'FreeName', email: 'free@test.com' };
      const errors = await asyncValidate(values);
      expect(errors).toEqual({});
    });
  });
});

__tests__/form.test.js:
import React from 'react';
import { shallow } from 'enzyme';
import { FormGroup } from '../components/form';

describe('FormGroup Component', () => {
  const children = <input type="text" />;

  it('renders without error when not touched', () => {
    const field = { touched: false, error: null };
    const wrapper = shallow(<FormGroup field={field}>{children}</FormGroup>);
    expect(wrapper.find('.help-block').length).toBe(0);
  });

  it('displays an error message when touched and error is present', () => {
    const field = { touched: true, error: 'Error message' };
    const wrapper = shallow(<FormGroup field={field}>{children}</FormGroup>);
    expect(wrapper.find('.help-block').text()).toBe('Error message');
  });

  it('applies success style when touched and no error', () => {
    const field = { touched: true, error: null };
    const wrapper = shallow(<FormGroup field={field}>{children}</FormGroup>);
    expect(wrapper.html()).toContain('bsStyle="success"');
  });
}

);

### Tokens: {'input_tokens': 1229, 'output_tokens': 3186, 'reasoning_tokens': 1536}
### Execution time: 24.66909694671631
