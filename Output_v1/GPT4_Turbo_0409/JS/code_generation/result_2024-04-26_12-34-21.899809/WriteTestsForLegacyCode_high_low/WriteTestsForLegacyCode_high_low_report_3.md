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
## Run 2:
### Answer:
```bash
# Install necessary testing libraries
npm install --save-dev jest @testing-library/react @testing-library/jest-dom redux-mock-store react-redux
```

```js
// setupTests.js
import '@testing-library/jest-dom/extend-expect';
```

```js
// __tests__/signup.test.js
import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent, waitFor } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { reduxForm } from 'redux-form';

import { Signup } from '../signup';
import * as api from '../api';

const mockStore = configureStore();
const initialState = {};
const store = mockStore(initialState);

jest.mock('../api', () => ({
  isName: jest.fn(),
  isEmail: jest.fn(),
  signup: jest.fn()
}));

const Decorated = reduxForm({
  form: 'testForm',
  validate: jest.fn(),
  asyncValidate: jest.fn(),
  asyncBlurFields: ['name', 'email']
})(Signup);

describe('Signup Component', () => {
  let component;
  const props = {
    fields: {
      name: { value: '', touched: false, error: '' },
      email: { value: '', touched: false, error: '' },
      password: { value: '', touched: false, error: '' }
    },
    handleSubmit: jest.fn(fn => fn),
    submitting: false,
    asyncValidating: false,
    dispatch: jest.fn()
  };

  beforeEach(() => {
    component = render(
      <Provider store={store}>
        <Decorated {...props} />
      </Provider>
    );
  });

  it('renders correctly', () => {
    expect(component.getByText('Join PodBaby today.')).toBeInTheDocument();
  });

  it('validates inputs correctly', async () => {
    const { getByPlaceholderText, getByText } = component;
    fireEvent.change(getByPlaceholderText('Name'), { target: { value: 'Jo' } });
    fireEvent.change(getByPlaceholderText('Email address'), { target: { value: 'invalid-email' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: '123' } });
    fireEvent.click(getByText('Signup'));

    await waitFor(() => {
      expect(props.handleSubmit).toHaveBeenCalled();
      expect(api.isName).not.toHaveBeenCalled();
      expect(api.isEmail).not.toHaveBeenCalled();
    });
  });

  it('submits form with valid data', async () => {
    api.signup.mockResolvedValue({ data: 'User created' });
    const { getByPlaceholderText, getByText } = component;
    fireEvent.change(getByPlaceholderText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(getByPlaceholderText('Email address'), { target: { value: 'john@example.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: '123456' } });
    fireEvent.click(getByText('Signup'));

    await waitFor(() => {
      expect(api.signup).toHaveBeenCalledWith('John Doe', 'john@example.com', '123456');
    });
  });

  it('handles server errors on submission', async () => {
    api.signup.mockRejectedValue({ data: 'Error' });
    const { getByPlaceholderText, getByText } = component;
    fireEvent.change(getByPlaceholderText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(getByPlaceholderText('Email address'), { target: { value: 'john@example.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: '123456' } });
    fireEvent.click(getByText('Signup'));

    await waitFor(() => {
      expect(api.signup).toHaveBeenCalledWith('John Doe', 'john@example.com', '123456');
    });
  });
});
```

### Tokens: {'input_tokens': 1181, 'output_tokens': 805}
### Execution time: 42.27465105056763
