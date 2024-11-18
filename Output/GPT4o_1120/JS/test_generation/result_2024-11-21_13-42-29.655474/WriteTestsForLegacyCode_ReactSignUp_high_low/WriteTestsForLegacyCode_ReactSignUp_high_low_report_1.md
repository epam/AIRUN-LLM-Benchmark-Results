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
// signup.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { reduxForm } from 'redux-form';
import { Signup } from './signup';
import * as api from '../api';
import '@testing-library/jest-dom';

jest.mock('../api', () => ({
  isName: jest.fn(),
  isEmail: jest.fn(),
  signup: jest.fn(),
}));

jest.mock('../components/icon', () => () => <span>Icon</span>);

const mockStore = configureStore([]);

const ReduxFormWrapper = reduxForm({
  form: 'signup',
  fields: ['name', 'email', 'password'],
})(Signup);

const renderComponent = (store) => {
  return render(
    <Provider store={store}>
      <ReduxFormWrapper />
    </Provider>
  );
};

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

  it('renders the signup form', () => {
    renderComponent(store);

    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Signup')).toBeInTheDocument();
    expect(screen.getByText('Already a member? Log in here.')).toBeInTheDocument();
  });

  it('validates form fields on submit', async () => {
    renderComponent(store);

    fireEvent.click(screen.getByText('Signup'));

    await waitFor(() => {
      expect(screen.getByText('Name must be between 3 and 60 characters in length')).toBeInTheDocument();
      expect(screen.getByText('A valid email address is required')).toBeInTheDocument();
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  it('shows async validation errors for name and email', async () => {
    api.isName.mockResolvedValue({ data: true });
    api.isEmail.mockResolvedValue({ data: true });

    renderComponent(store);

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'testname' } });
    fireEvent.blur(screen.getByPlaceholderText('Name'));

    fireEvent.change(screen.getByPlaceholderText('Email address'), { target: { value: 'test@example.com' } });
    fireEvent.blur(screen.getByPlaceholderText('Email address'));

    await waitFor(() => {
      expect(screen.getByText('This name is already in use')).toBeInTheDocument();
      expect(screen.getByText('This email is already in use')).toBeInTheDocument();
    });
  });

  it('submits the form successfully', async () => {
    api.signup.mockResolvedValue({ data: { success: true } });

    renderComponent(store);

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'validname' } });
    fireEvent.change(screen.getByPlaceholderText('Email address'), { target: { value: 'valid@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'validpassword' } });

    fireEvent.click(screen.getByText('Signup'));

    await waitFor(() => {
      expect(api.signup).toHaveBeenCalledWith('validname', 'valid@example.com', 'validpassword');
    });
  });

  it('handles form submission errors', async () => {
    api.signup.mockRejectedValue({ data: { error: 'Signup failed' } });

    renderComponent(store);

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'validname' } });
    fireEvent.change(screen.getByPlaceholderText('Email address'), { target: { value: 'valid@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'validpassword' } });

    fireEvent.click(screen.getByText('Signup'));

    await waitFor(() => {
      expect(api.signup).toHaveBeenCalledWith('validname', 'valid@example.com', 'validpassword');
    });
  });
});
```

### Tokens: {'input_tokens': 1230, 'output_tokens': 942, 'reasoning_tokens': 0}
### Execution time: 7.715705871582031
