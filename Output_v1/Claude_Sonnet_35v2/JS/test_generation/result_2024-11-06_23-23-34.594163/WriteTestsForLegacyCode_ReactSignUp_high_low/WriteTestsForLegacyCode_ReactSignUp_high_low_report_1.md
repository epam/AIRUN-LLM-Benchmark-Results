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
I'll create unit tests using Jest and React Testing Library, which are popular choices for React applications. Here are the test files:

signup.test.js
```javascript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';
import { Signup } from './signup';
import * as api from '../api';

jest.mock('../api');

const mockStore = configureStore([]);

describe('Signup Component', () => {
  let store;
  let history;

  beforeEach(() => {
    store = mockStore({});
    history = createMemoryHistory();
    api.signup.mockReset();
    api.isEmail.mockReset();
    api.isName.mockReset();
  });

  const renderSignup = (props = {}) => {
    const defaultProps = {
      fields: {
        name: { value: '', touched: false },
        email: { value: '', touched: false },
        password: { value: '', touched: false }
      },
      handleSubmit: fn => fn,
      submitting: false,
      asyncValidating: false,
      dispatch: jest.fn(),
      ...props
    };

    return render(
      <Provider store={store}>
        <Router history={history}>
          <Signup {...defaultProps} />
        </Router>
      </Provider>
    );
  };

  it('renders signup form correctly', () => {
    renderSignup();
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Signup')).toBeInTheDocument();
  });

  it('handles successful signup', async () => {
    const mockData = { token: 'test-token' };
    api.signup.mockResolvedValue({ data: mockData });

    const { container } = renderSignup();
    
    fireEvent.change(screen.getByPlaceholderText('Name'), {
      target: { value: 'Test User' }
    });
    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByText('Signup'));

    await waitFor(() => {
      expect(api.signup).toHaveBeenCalledWith(
        'Test User',
        'test@example.com',
        'password123'
      );
    });
  });

  it('handles signup failure', async () => {
    const errorData = { message: 'Signup failed' };
    api.signup.mockRejectedValue({ data: errorData });

    const { container } = renderSignup();
    
    fireEvent.change(screen.getByPlaceholderText('Name'), {
      target: { value: 'Test User' }
    });
    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByText('Signup'));

    await waitFor(() => {
      expect(api.signup).toHaveBeenCalled();
    });
  });
});
```

form.test.js
```javascript
import React from 'react';
import { render, screen } from '@testing-library/react';
import { FormGroup } from './form';

describe('FormGroup Component', () => {
  it('renders without error state', () => {
    const field = {
      touched: false,
      error: null
    };

    render(
      <FormGroup field={field}>
        <input type="text" />
      </FormGroup>
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders with error state', () => {
    const field = {
      touched: true,
      error: 'This field is required'
    };

    render(
      <FormGroup field={field}>
        <input type="text" />
      </FormGroup>
    );

    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('renders with success state', () => {
    const field = {
      touched: true,
      error: null
    };

    render(
      <FormGroup field={field}>
        <input type="text" />
      </FormGroup>
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});
```

jest.config.js
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/serviceWorker.js',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

package.json (testing-related dependencies)
```json
{
  "devDependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^14.4.3",
    "jest": "^29.3.1",
    "jest-environment-jsdom": "^29.3.1",
    "redux-mock-store": "^1.5.4"
  }
}
```

### Tokens: {'input_tokens': 1527, 'output_tokens': 1594}
### Execution time: 28.019593954086304
