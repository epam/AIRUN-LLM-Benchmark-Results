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
```js
// Signup.test.js
import React from 'react';
import { shallow, mount } from 'enzyme';
import { Signup } from './signup';
import * as api from '../api';
import { Button } from 'react-bootstrap';
import { reduxForm } from 'redux-form';

jest.mock('../api');

const setup = (overrides = {}) => {
  const props = {
    fields: {
      name: { touched: false, error: null },
      email: { touched: false, error: null },
      password: { touched: false, error: null },
    },
    handleSubmit: jest.fn(fn => fn),
    submitting: false,
    asyncValidating: false,
    dispatch: jest.fn(),
    ...overrides
  };
  
  const wrapper = shallow(<Signup {...props} />);
  return { props, wrapper };
};

describe('Signup Component', () => {
  it('renders without crashing', () => {
    const { wrapper } = setup();
    expect(wrapper.exists()).toBe(true);
  });

  it('renders the form component', () => {
    const { wrapper } = setup();
    expect(wrapper.find('form').exists()).toBe(true);
  });

  it('renders the input fields', () => {
    const { wrapper } = setup();
    expect(wrapper.find('input[type="text"]').exists()).toBe(true);
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
  });

  it('handles form submission', () => {
    const { wrapper } = setup();
    const instance = wrapper.instance();
    
    const values = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123',
    };

    api.signup.mockImplementation(() => Promise.resolve({ data: {} }));
    
    return instance.handleSubmit(values).then(() => {
      expect(api.signup).toHaveBeenCalledWith('John Doe', 'johndoe@example.com', 'password123');
    });
  });

  it('shows validation errors', () => {
    const { wrapper } = setup({
      fields: {
        name: { touched: true, error: 'Name is required' },
        email: { touched: true, error: 'A valid email is required' },
        password: { touched: true, error: 'Password must be at least 6 characters' },
      }
    });
    
    expect(wrapper.find('.help-block').at(0).text()).toBe('Name is required');
    expect(wrapper.find('.help-block').at(1).text()).toBe('A valid email is required');
    expect(wrapper.find('.help-block').at(2).text()).toBe('Password must be at least 6 characters');
  });

  it('disables submit button while submitting', () => {
    const { wrapper } = setup({ submitting: true });
    expect(wrapper.find(Button).prop('disabled')).toBeTruthy();
  });
});

// asyncValidate.test.js
import { asyncValidate } from './signup';
import * as api from '../api';

jest.mock('../api');

describe('asyncValidate', () => {
  it('should return no errors if valid', async () => {
    api.isName.mockImplementation(() => Promise.resolve({ data: false }));
    api.isEmail.mockImplementation(() => Promise.resolve({ data: false }));

    const values = { name: 'John', email: 'john@example.com' };
    const errors = await asyncValidate(values);
    expect(errors).toEqual({});
  });

  it('should return an error for an existing name', async () => {
    api.isName.mockImplementation(() => Promise.resolve({ data: true }));

    const values = { name: 'John', email: 'john@example.com' };
    const errors = await asyncValidate(values);
    expect(errors).toEqual({ name: 'This name is already in use' });
  });

  it('should return an error for an existing email', async () => {
    api.isEmail.mockImplementation(() => Promise.resolve({ data: true }));

    const values = { name: 'John', email: 'john@example.com' };
    const errors = await asyncValidate(values);
    expect(errors).toEqual({ email: 'This email is already in use' });
  });
});
```

### Tokens: {'input_tokens': 1230, 'output_tokens': 899, 'reasoning_tokens': 0}
### Execution time: 14.191856861114502
