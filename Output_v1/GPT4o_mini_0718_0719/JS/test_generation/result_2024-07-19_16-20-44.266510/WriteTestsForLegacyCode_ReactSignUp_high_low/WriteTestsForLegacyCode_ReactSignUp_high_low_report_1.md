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
// Signup.test.js
import React from 'react';
import { shallow } from 'enzyme';
import { Signup } from './signup';
import * as api from '../api';
import { Button } from 'react-bootstrap';
import { reduxForm } from 'redux-form';

jest.mock('../api');

const setup = (props = {}) => {
  const initialProps = {
    fields: {
      name: { touched: false, error: '', value: '' },
      email: { touched: false, error: '', value: '' },
      password: { touched: false, error: '', value: '' },
    },
    handleSubmit: jest.fn(),
    submitting: false,
    asyncValidating: false,
    dispatch: jest.fn(),
    ...props,
  };

  return shallow(<Signup {...initialProps} />);
};

describe('Signup Component', () => {
  it('renders without crashing', () => {
    const wrapper = setup();
    expect(wrapper.exists()).toBe(true);
  });

  it('displays the correct title', () => {
    const wrapper = setup();
    expect(wrapper.find('h2').text()).toBe('Join PodBaby today.');
  });

  it('validates name correctly', () => {
    const errors = validate({ name: 'ab', email: 'test@test.com', password: '123456' });
    expect(errors.name).toBe('Name must be between 3 and 60 characters in length');
  });

  it('validates email correctly', () => {
    const errors = validate({ name: 'Test User', email: 'invalid-email', password: '123456' });
    expect(errors.email).toBe('A valid email address is required');
  });

  it('validates password correctly', () => {
    const errors = validate({ name: 'Test User', email: 'test@test.com', password: '123' });
    expect(errors.password).toBe('Password must be at least 6 characters');
  });

  it('handles form submission', async () => {
    const wrapper = setup();
    const instance = wrapper.instance();
    const values = { name: 'Test User', email: 'test@test.com', password: '123456' };

    api.signup.mockResolvedValue({ data: {} });
    await instance.handleSubmit(values);

    expect(api.signup).toHaveBeenCalledWith('Test User', 'test@test.com', '123456');
  });

  it('shows error on failed signup', async () => {
    const wrapper = setup();
    const instance = wrapper.instance();
    const values = { name: 'Test User', email: 'test@test.com', password: '123456' };

    api.signup.mockRejectedValue({ data: 'Signup failed' });
    await expect(instance.handleSubmit(values)).rejects.toEqual('Signup failed');
  });

  it('disables the submit button when submitting', () => {
    const wrapper = setup({ submitting: true });
    expect(wrapper.find(Button).prop('disabled')).toBe(true);
  });
});

// form.test.js
import React from 'react';
import { shallow } from 'enzyme';
import { FormGroup } from './form';

const setup = (props = {}) => {
  const initialProps = {
    field: {
      touched: false,
      error: '',
    },
    children: <input type="text" />,
    ...props,
  };

  return shallow(<FormGroup {...initialProps} />);
};

describe('FormGroup Component', () => {
  it('renders without crashing', () => {
    const wrapper = setup();
    expect(wrapper.exists()).toBe(true);
  });

  it('shows error message when field is touched and has an error', () => {
    const wrapper = setup({ field: { touched: true, error: 'Error message' } });
    expect(wrapper.find('.help-block').text()).toBe('Error message');
  });

  it('does not show error message when field is not touched', () => {
    const wrapper = setup();
    expect(wrapper.find('.help-block').exists()).toBe(false);
  });

  it('shows success feedback when field is touched and has no error', () => {
    const wrapper = setup({ field: { touched: true, error: '' } });
    expect(wrapper.find('Input').prop('bsStyle')).toBe('success');
  });
});
```

### Tokens: {'input_tokens': 1230, 'output_tokens': 900}
### Execution time: 12.897808074951172
