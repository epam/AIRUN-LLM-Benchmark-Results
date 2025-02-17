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
// package.json
{
  "name": "legacy-frontend-tests",
  "version": "1.0.0",
  "scripts": {
    "test": "jest --coverage"
  },
  "dependencies": {
    "react": "^16.14.0",
    "react-bootstrap": "^0.33.1",
    "react-document-title": "^2.0.3",
    "react-router": "^3.2.0",
    "redux": "^4.0.5",
    "redux-form": "^6.8.0",
    "validator": "^13.7.0"
  },
  "devDependencies": {
    "enzyme": "^3.11.0",
    "enzyme-adapter-react-16": "^1.15.7",
    "jest": "^27.0.6",
    "react-test-renderer": "^16.14.0"
  },
  "jest": {
    "setupFilesAfterEnv": [
      "<rootDir>/setupTests.js"
    ],
    "moduleNameMapper": {
      "\\.(css|less)$": "identity-obj-proxy"
    }
  }
}

// setupTests.js
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

// __tests__/Signup.test.js
import React from 'react';
import { shallow, mount } from 'enzyme';
import DocumentTitle from 'react-document-title';
import { Signup } from '../signup';
import * as api from '../api';
import { Button } from 'react-bootstrap';

jest.mock('../api', () => ({
  signup: jest.fn(),
  isName: jest.fn(),
  isEmail: jest.fn()
}));

jest.mock('../actions', () => ({
  auth: {
    signupComplete: jest.fn(data => ({ type: 'SIGNUP_COMPLETE', payload: data }))
  }
}));

jest.mock('../components/icon', () => () => <span className="icon" />);

const dummyFields = {
  name: { touched: false, error: '', value: '' },
  email: { touched: false, error: '', value: '' },
  password: { touched: false, error: '', value: '' }
};

const dummyDispatch = jest.fn();

const dummyHandleSubmit = fn => fn;

describe('Signup Component', () => {
  let props;
  let wrapper;
  let signupInstance;

  beforeEach(() => {
    props = {
      fields: dummyFields,
      handleSubmit: dummyHandleSubmit,
      submitting: false,
      asyncValidating: false,
      dispatch: dummyDispatch
    };
    wrapper = shallow(<Signup {...props} />);
    signupInstance = wrapper.instance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form with correct elements', () => {
    const mountedWrapper = mount(<Signup {...props} />);
    expect(mountedWrapper.find('form.form-horizontal')).toHaveLength(1);
    expect(mountedWrapper.find('input[type="text"]').prop('placeholder')).toEqual('Name');
    expect(mountedWrapper.find('input[type="email"]').prop('placeholder')).toEqual('Email address');
    expect(mountedWrapper.find('input[type="password"]').prop('placeholder')).toEqual('Password');
    expect(mountedWrapper.find(Button)).toHaveLength(1);
    expect(mountedWrapper.find(DocumentTitle)).toHaveLength(1);
  });

  it('submits form successfully and dispatches action', async () => {
    const mockData = { id: 1, token: 'abc' };
    const response = { data: mockData };
    api.signup.mockResolvedValue(response);
    const values = { name: 'John Doe', email: 'john@example.com', password: 'secret123' };

    await expect(signupInstance.handleSubmit(values)).resolves.toBeUndefined();

    expect(api.signup).toHaveBeenCalledWith(values.name, values.email, values.password);
    expect(dummyDispatch).toHaveBeenCalled();
  });

  it('handles submission error correctly', async () => {
    const errorData = { message: 'Error occurred' };
    api.signup.mockRejectedValue({ data: errorData });
    const values = { name: 'Jane Doe', email: 'jane@example.com', password: 'secret123' };

    await expect(signupInstance.handleSubmit(values)).rejects.toEqual(errorData);
    expect(api.signup).toHaveBeenCalledWith(values.name, values.email, values.password);
  });

  it('binds authentication actions in constructor', () => {
    const instance = new Signup(props);
    expect(instance.actions).toBeDefined();
  });
});

// __tests__/FormGroup.test.js
import React from 'react';
import { shallow } from 'enzyme';
import { FormGroup } from '../components/form';

describe('FormGroup Component', () => {
  const defaultField = { touched: false, error: '' };

  it('renders children correctly', () => {
    const child = <input />;
    const wrapper = shallow(<FormGroup field={defaultField}>{child}</FormGroup>);
    expect(wrapper.contains(child)).toBe(true);
  });

  it('applies bsStyle "error" when field is touched and has an error', () => {
    const errorField = { touched: true, error: 'Error message' };
    const wrapper = shallow(
      <FormGroup field={errorField}>
        <input />
      </FormGroup>
    );
    expect(wrapper.find('span.help-block').text()).toEqual('Error message');
    expect(wrapper.prop('bsStyle')).toBe('error');
  });

  it('applies bsStyle "success" when field is touched and has no error', () => {
    const successField = { touched: true, error: '' };
    const wrapper = shallow(
      <FormGroup field={successField}>
        <input />
      </FormGroup>
    );
    expect(wrapper.prop('bsStyle')).toBe('success');
  });

  it('does not show help block when field is not touched', () => {
    const untouchedField = { touched: false, error: 'Error' };
    const wrapper = shallow(
      <FormGroup field={untouchedField}>
        <input />
      </FormGroup>
    );
    expect(wrapper.find('span.help-block')).toHaveLength(0);
  });
});

### Tokens: {'input_tokens': 1229, 'output_tokens': 3960, 'reasoning_tokens': 2624}
### Execution time: 50.04091691970825
