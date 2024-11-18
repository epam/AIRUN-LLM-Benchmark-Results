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
## Unit Tests for Signup Component

**Testing Libraries:** Jest, React Testing Library

**Setup:**

1. Install required packages: `npm install --save-dev jest @testing-library/react @testing-library/jest-dom`
2. Create a `jest.config.js` file in your project root with the following configuration:

```javascript
module.exports = {
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
};
```

**signup.test.js:**

```javascript
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { reduxForm } from 'redux-form';

import { Signup } from './signup';
import * as api from '../api';

jest.mock('../api');

const mockStore = configureStore([]);

const DecoratedSignup = reduxForm({ form: 'signup' })(Signup);

describe('Signup component', () => {
  let store;
  let component;

  beforeEach(() => {
    store = mockStore({
      form: {
        signup: {
          values: {},
        },
      },
    });
    component = render(
      <Provider store={store}>
        <DecoratedSignup />
      </Provider>
    );
  });

  it('renders signup form', () => {
    expect(component.getByText('Join PodBaby today.')).toBeInTheDocument();
    expect(component.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(component.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(component.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('validates form fields on submit', async () => {
    fireEvent.click(component.getByText('Signup'));

    await waitFor(() => {
      expect(component.getByText('Name must be between 3 and 60 characters in length')).toBeInTheDocument();
      expect(component.getByText('A valid email address is required')).toBeInTheDocument();
      expect(component.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  it('displays error messages for invalid email and password', async () => {
    fireEvent.change(component.getByPlaceholderText('Email address'), { target: { value: 'invalid_email' } });
    fireEvent.change(component.getByPlaceholderText('Password'), { target: { value: '123' } });
    fireEvent.blur(component.getByPlaceholderText('Email address'));
    fireEvent.blur(component.getByPlaceholderText('Password'));

    await waitFor(() => {
      expect(component.getByText('A valid email address is required')).toBeInTheDocument();
      expect(component.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  it('calls api.signup on submit with valid data', async () => {
    api.signup.mockResolvedValue({ data: {} });

    fireEvent.change(component.getByPlaceholderText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(component.getByPlaceholderText('Email address'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(component.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(component.getByText('Signup'));

    await waitFor(() => {
      expect(api.signup).toHaveBeenCalledWith('John Doe', 'john.doe@example.com', 'password123');
    });
  });

  it('displays async validation errors', async () => {
    api.isName.mockResolvedValue({ data: true });
    api.isEmail.mockResolvedValue({ data: true });

    fireEvent.change(component.getByPlaceholderText('Name'), { target: { value: 'Existing Name' } });
    fireEvent.change(component.getByPlaceholderText('Email address'), { target: { value: 'existing@email.com' } });
    fireEvent.blur(component.getByPlaceholderText('Name'));
    fireEvent.blur(component.getByPlaceholderText('Email address'));

    await waitFor(() => {
      expect(component.getByText('This name is already in use')).toBeInTheDocument();
      expect(component.getByText('This email is already in use')).toBeInTheDocument();
    });
  });
});
```

**form.test.js:**

```javascript
import React from 'react';
import { render } from '@testing-library/react';

import { FormGroup } from './form';

describe('FormGroup component', () => {
  it('renders input with children', () => {
    const field = { touched: false, error: null };
    const { getByText } = render(
      <FormGroup field={field}>
        <input type="text" />
      </FormGroup>
    );
    expect(getByText('input')).toBeInTheDocument();
  });

  it('displays error message when field is touched and has error', () => {
    const field = { touched: true, error: 'Error message' };
    const { getByText } = render(
      <FormGroup field={field}>
        <input type="text" />
      </FormGroup>
    );
    expect(getByText('Error message')).toBeInTheDocument();
  });
});
``` 


### Tokens: {'input_tokens': 1407, 'output_tokens': 1236}
### Execution time: 37.98782968521118
