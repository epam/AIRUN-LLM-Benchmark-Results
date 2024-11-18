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
```js
// form.test.js
import React from 'react';
import { render } from '@testing-library/react';
import { FormGroup } from './form';

jest.mock('react-bootstrap', () => ({
  Input: ({ hasFeedback, bsStyle, children }) => (
    <div data-has-feedback={hasFeedback} data-bs-style={bsStyle}>
      {children}
    </div>
  ),
}));

describe('FormGroup component', () => {
  it('renders correctly when field is untouched', () => {
    const field = {
      touched: false,
      error: null,
    };
    const { container } = render(
      <FormGroup field={field}>
        <input type="text" />
      </FormGroup>
    );
    expect(container).toMatchSnapshot();
  });

  it('renders with success when field is touched and has no error', () => {
    const field = {
      touched: true,
      error: null,
    };
    const { container } = render(
      <FormGroup field={field}>
        <input type="text" />
      </FormGroup>
    );
    expect(container).toMatchSnapshot();
  });

  it('renders with error when field is touched and has an error', () => {
    const field = {
      touched: true,
      error: 'Required field',
    };
    const { getByText } = render(
      <FormGroup field={field}>
        <input type="text" />
      </FormGroup>
    );
    expect(getByText('Required field')).toBeInTheDocument();
  });
});
```

```js
// signup.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import Signup from './signup';
import * as api from '../api';
import { auth } from '../actions';

jest.mock('../api');
jest.mock('react-bootstrap', () => ({
  Button: ({ children, ...props }) => (
    <button {...props}>{children}</button>
  ),
}));
jest.mock('../components/form', () => ({
  FormGroup: ({ field, children }) => (
    <div data-field={JSON.stringify(field)}>
      {children}
      {field.touched && field.error && <span>{field.error}</span>}
    </div>
  ),
}));
jest.mock('../components/icon', () => () => <span>Icon</span>);
jest.mock('react-document-title', () => ({ children }) => <div>{children}</div>);
jest.mock('react-router', () => ({
  Link: ({ children, ...props }) => <a {...props}>{children}</a>,
}));

describe('Signup component', () => {
  const mockStore = configureStore([]);
  let store;

  beforeEach(() => {
    store = mockStore({});
    api.signup.mockClear();
  });

  it('renders without crashing', () => {
    const { container } = render(
      <Provider store={store}>
        <Signup />
      </Provider>
    );
    expect(container).toMatchSnapshot();
  });

  it('submits the form successfully', async () => {
    api.signup.mockResolvedValue({ data: { success: true } });
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <Signup />
      </Provider>
    );

    fireEvent.change(getByPlaceholderText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(getByPlaceholderText('Email address'), { target: { value: 'john@example.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password123' } });

    const submitButton = getByText(/Signup/);

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.signup).toHaveBeenCalledWith('John Doe', 'john@example.com', 'password123');
      const actions = store.getActions();
      expect(actions).toContainEqual(auth.signupComplete({ success: true }));
    });
  });

  it('handles submission failure', async () => {
    api.signup.mockRejectedValue({ data: { error: 'Signup failed' } });

    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <Signup />
      </Provider>
    );

    fireEvent.change(getByPlaceholderText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(getByPlaceholderText('Email address'), { target: { value: 'john@example.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password123' } });

    const submitButton = getByText(/Signup/);

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.signup).toHaveBeenCalledWith('John Doe', 'john@example.com', 'password123');
      const actions = store.getActions();
      expect(actions).not.toContainEqual(auth.signupComplete(expect.anything()));
    });
  });

  it('shows validation errors', async () => {
    api.signup.mockResolvedValue({ data: { success: true } });
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <Signup />
      </Provider>
    );

    fireEvent.change(getByPlaceholderText('Name'), { target: { value: 'Jo' } });
    fireEvent.change(getByPlaceholderText('Email address'), { target: { value: 'invalid-email' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: '123' } });

    const submitButton = getByText(/Signup/);

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(getByText('Name must be between 3 and 60 characters in length')).toBeInTheDocument();
      expect(getByText('A valid email address is required')).toBeInTheDocument();
      expect(getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  it('shows async validation errors', async () => {
    api.isName.mockResolvedValue({ data: true });
    api.isEmail.mockResolvedValue({ data: true });

    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <Signup />
      </Provider>
    );

    fireEvent.change(getByPlaceholderText('Name'), { target: { value: 'UsedName' } });
    fireEvent.blur(getByPlaceholderText('Name'));

    fireEvent.change(getByPlaceholderText('Email address'), { target: { value: 'used@example.com' } });
    fireEvent.blur(getByPlaceholderText('Email address'));

    await waitFor(() => {
      expect(getByText('This name is already in use')).toBeInTheDocument();
      expect(getByText('This email is already in use')).toBeInTheDocument();
    });
  });
});
```

```js
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
```

```js
// jest.setup.js
import '@testing-library/jest-dom/extend-expect';
```

```js
// babel.config.js
module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
  ],
};
```

```json
// package.json
{
  "devDependencies": {
    "@babel/core": "^7.13.15",
    "@babel/preset-env": "^7.13.15",
    "@babel/preset-react": "^7.13.13",
    "@testing-library/jest-dom": "^5.11.6",
    "@testing-library/react": "^11.2.5",
    "babel-jest": "^26.6.3",
    "jest": "^26.6.3",
    "redux-mock-store": "^1.5.4"
  }
}
```

### Tokens: {'input_tokens': 1259, 'output_tokens': 8047, 'reasoning_tokens': 6336}
### Execution time: 62.99970769882202
