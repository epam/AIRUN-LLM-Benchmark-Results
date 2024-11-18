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
```json
{
  "name": "signup-unit-tests",
  "version": "1.0.0",
  "scripts": {
    "test": "jest --coverage"
  },
  "dependencies": {
    "react": "^16.14.0",
    "redux": "^4.0.5",
    "redux-form": "^6.8.0",
    "validator": "^13.6.0",
    "react-bootstrap": "^0.33.1",
    "react-router": "^3.2.0",
    "react-document-title": "^2.0.3"
  },
  "devDependencies": {
    "@testing-library/react": "^11.2.7",
    "@testing-library/jest-dom": "^5.11.6",
    "jest": "^26.6.3",
    "redux-mock-store": "^1.5.4",
    "redux-thunk": "^2.3.0",
    "axios": "^0.21.1"
  }
}
```

```js
// __tests__/signup.test.js
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Signup } from '../signup';
import * as api from '../api';
import { reduxForm } from 'redux-form';

jest.mock('../api');

const mockStore = configureMockStore([thunk]);

const DecoratedSignup = reduxForm({
  form: 'signup',
  fields: ['name', 'email', 'password'],
  validate: () => ({}),
})(Signup);

describe('Signup Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      form: {
        signup: {
          values: {},
          asyncErrors: {},
        },
      },
    });
  });

  test('renders signup form', () => {
    render(
      <Provider store={store}>
        <DecoratedSignup />
      </Provider>
    );

    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Signup')).toBeInTheDocument();
  });

  test('validates form fields', async () => {
    render(
      <Provider store={store}>
        <DecoratedSignup />
      </Provider>
    );

    fireEvent.click(screen.getByText('Signup'));

    await waitFor(() => {
      expect(screen.getByText('Name must be between 3 and 60 characters in length')).toBeInTheDocument();
      expect(screen.getByText('A valid email address is required')).toBeInTheDocument();
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  test('submits form successfully', async () => {
    api.signup.mockResolvedValue({ data: { token: 'fake-token' } });

    render(
      <Provider store={store}>
        <DecoratedSignup />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Email address'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByText('Signup'));

    await waitFor(() => {
      expect(api.signup).toHaveBeenCalledWith('John Doe', 'john@example.com', 'password123');
    });
  });

  test('handles signup error', async () => {
    api.signup.mockRejectedValue({ data: { error: 'Signup failed' } });

    render(
      <Provider store={store}>
        <DecoratedSignup />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Email address'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByText('Signup'));

    await waitFor(() => {
      expect(api.signup).toHaveBeenCalledWith('John Doe', 'john@example.com', 'password123');
    });
  });
});
```

```js
// __tests__/formGroup.test.js
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { FormGroup } from '../components/form';

describe('FormGroup Component', () => {
  test('renders with error', () => {
    const field = {
      touched: true,
      error: 'This field is required',
    };

    const { getByText } = render(
      <FormGroup field={field}>
        <input type="text" />
      </FormGroup>
    );

    expect(getByText('This field is required')).toBeInTheDocument();
  });

  test('renders without error', () => {
    const field = {
      touched: true,
      error: null,
    };

    const { queryByText } = render(
      <FormGroup field={field}>
        <input type="text" />
      </FormGroup>
    );

    expect(queryByText('This field is required')).not.toBeInTheDocument();
  });
});
```

### Tokens: {'input_tokens': 1230, 'output_tokens': 1210, 'reasoning_tokens': 0}
### Execution time: 11.71275806427002
