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
__tests__/signup.test.js
```js
import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { reduxForm } from 'redux-form';
import Signup, { Signup as SignupComponent } from '../signup';
import * as api from '../../api';
import { auth } from '../../actions';

jest.mock('../../api');
jest.mock('../../actions', () => ({
  auth: {
    signupComplete: jest.fn().mockReturnValue({ type: 'SIGNUP_COMPLETE' }),
  },
}));

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const renderWithReduxForm = (component, store) => {
  const Decorated = reduxForm({
    form: 'signup',
  })(() => component);

  return render(
    <Provider store={store}>
      <Decorated />
    </Provider>
  );
};

describe('Signup Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
    api.signup.mockClear();
    api.isName.mockClear();
    api.isEmail.mockClear();
    auth.signupComplete.mockClear();
  });

  test('renders signup form correctly', () => {
    renderWithReduxForm(<SignupComponent dispatch={store.dispatch} fields={{ name: {}, email: {}, password: {} }} handleSubmit={() => {}} submitting={false} asyncValidating={false} />, store);

    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Signup/i })).toBeInTheDocument();
  });

  test('validates form fields correctly', async () => {
    renderWithReduxForm(<Signup dispatch={store.dispatch} />, store);

    fireEvent.blur(screen.getByPlaceholderText('Name'));
    fireEvent.blur(screen.getByPlaceholderText('Email address'));
    fireEvent.blur(screen.getByPlaceholderText('Password'));

    await waitFor(() => {
      expect(screen.getByText('Name must be between 3 and 60 characters in length')).toBeInTheDocument();
      expect(screen.getByText('A valid email address is required')).toBeInTheDocument();
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  test('handles successful signup', async () => {
    api.signup.mockResolvedValue({ data: { id: 1, name: 'Test User' } });

    renderWithReduxForm(<Signup dispatch={store.dispatch} />, store);

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('Email address'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /Signup/i }));

    await waitFor(() => {
      expect(api.signup).toHaveBeenCalledWith('Test User', 'test@example.com', 'password123');
      expect(auth.signupComplete).toHaveBeenCalledWith({ id: 1, name: 'Test User' });
    });
  });

  test('handles signup API error', async () => {
    api.signup.mockRejectedValue({ data: { email: 'Email already exists' } });

    renderWithReduxForm(<Signup dispatch={store.dispatch} />, store);

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('Email address'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /Signup/i }));

    await waitFor(() => {
      expect(api.signup).toHaveBeenCalledWith('Test User', 'test@example.com', 'password123');
      expect(auth.signupComplete).not.toHaveBeenCalled();
    });
  });

  test('async validates name and email uniqueness', async () => {
    api.isName.mockResolvedValue({ data: true });
    api.isEmail.mockResolvedValue({ data: true });

    renderWithReduxForm(<Signup dispatch={store.dispatch} />, store);

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'ExistingUser' } });
    fireEvent.blur(screen.getByPlaceholderText('Name'));

    fireEvent.change(screen.getByPlaceholderText('Email address'), { target: { value: 'existing@example.com' } });
    fireEvent.blur(screen.getByPlaceholderText('Email address'));

    await waitFor(() => {
      expect(api.isName).toHaveBeenCalledWith('ExistingUser');
      expect(api.isEmail).toHaveBeenCalledWith('existing@example.com');
      expect(screen.getByText('This name is already in use')).toBeInTheDocument();
      expect(screen.getByText('This email is already in use')).toBeInTheDocument();
    });
  });
});
```

__tests__/form.test.js
```js
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FormGroup } from '../form';

describe('FormGroup Component', () => {
  test('renders children correctly', () => {
    render(
      <FormGroup field={{ touched: false }}>
        <input placeholder="Test Input" />
      </FormGroup>
    );

    expect(screen.getByPlaceholderText('Test Input')).toBeInTheDocument();
  });

  test('shows error message when field has error and is touched', () => {
    render(
      <FormGroup field={{ touched: true, error: 'Required field' }}>
        <input placeholder="Test Input" />
      </FormGroup>
    );

    expect(screen.getByText('Required field')).toBeInTheDocument();
  });

  test('does not show error message when field is not touched', () => {
    render(
      <FormGroup field={{ touched: false, error: 'Required field' }}>
        <input placeholder="Test Input" />
      </FormGroup>
    );

    expect(screen.queryByText('Required field')).not.toBeInTheDocument();
  });

  test('applies correct bsStyle based on field state', () => {
    const { container, rerender } = render(
      <FormGroup field={{ touched: true, error: 'Error' }}>
        <input placeholder="Test Input" />
      </FormGroup>
    );

    expect(container.querySelector('.has-error')).toBeInTheDocument();

    rerender(
      <FormGroup field={{ touched: true }}>
        <input placeholder="Test Input" />
      </FormGroup>
    );

    expect(container.querySelector('.has-success')).toBeInTheDocument();
  });
});
```

jest.config.js
```js
module.exports = {
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
};
```

package.json (relevant dependencies)
```json
{
  "devDependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^14.0.0",
    "jest": "^29.0.0",
    "redux-mock-store": "^1.5.4",
    "identity-obj-proxy": "^3.0.0",
    "redux-thunk": "^2.4.2"
  }
}
```

### Tokens: {'input_tokens': 1230, 'output_tokens': 1693, 'reasoning_tokens': 0}
### Execution time: 47.68059182167053
