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
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Signup } from './signup';
import * as api from '../api';
import { auth } from '../actions';
import { FormGroup } from '../components/form';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const initialState = {};
const store = mockStore(initialState);

jest.mock('../api', () => ({
  signup: jest.fn(),
  isName: jest.fn(),
  isEmail: jest.fn(),
}));

describe('Signup Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the signup form', () => {
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <Signup />
      </Provider>
    );

    expect(getByPlaceholderText('Name')).toBeInTheDocument();
    expect(getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(getByPlaceholderText('Password')).toBeInTheDocument();
    expect(getByText('Signup')).toBeInTheDocument();
  });

  it('displays validation errors for invalid input', async () => {
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <Signup />
      </Provider>
    );

    fireEvent.change(getByPlaceholderText('Name'), { target: { value: 'A' } });
    fireEvent.change(getByPlaceholderText('Email address'), { target: { value: 'invalid-email' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: '123' } });
    fireEvent.click(getByText('Signup'));

    await waitFor(() => {
      expect(getByText('Name must be between 3 and 60 characters in length')).toBeInTheDocument();
      expect(getByText('A valid email address is required')).toBeInTheDocument();
      expect(getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  it('successfully submits the form with valid input', async () => {
    api.signup.mockResolvedValue({ data: { success: true } });
    api.isName.mockResolvedValue({ data: false });
    api.isEmail.mockResolvedValue({ data: false });

    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <Signup />
      </Provider>
    );

    fireEvent.change(getByPlaceholderText('Name'), { target: { value: 'ValidName' } });
    fireEvent.change(getByPlaceholderText('Email address'), { target: { value: 'valid@email.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'validpassword' } });
    fireEvent.click(getByText('Signup'));

    await waitFor(() => {
      expect(api.signup).toHaveBeenCalledWith('ValidName', 'valid@email.com', 'validpassword');
    });
  });

  it('displays error message for duplicate name', async () => {
    api.isName.mockResolvedValue({ data: true });

    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <Signup />
      </Provider>
    );

    fireEvent.change(getByPlaceholderText('Name'), { target: { value: 'DuplicateName' } });
    fireEvent.blur(getByPlaceholderText('Name'));

    await waitFor(() => {
      expect(getByText('This name is already in use')).toBeInTheDocument();
    });
  });

  it('displays error message for duplicate email', async () => {
    api.isEmail.mockResolvedValue({ data: true });

    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <Signup />
      </Provider>
    );

    fireEvent.change(getByPlaceholderText('Email address'), { target: { value: 'duplicate@email.com' } });
    fireEvent.blur(getByPlaceholderText('Email address'));

    await waitFor(() => {
      expect(getByText('This email is already in use')).toBeInTheDocument();
    });
  });
});

describe('FormGroup Component', () => {
  it('renders with error state', () => {
    const { getByText } = render(
      <FormGroup field={{ touched: true, error: 'This is an error' }}>
        <input type="text" />
      </FormGroup>
    );

    expect(getByText('This is an error')).toBeInTheDocument();
  });

  it('renders with success state', () => {
    const { queryByText } = render(
      <FormGroup field={{ touched: true }}>
        <input type="text" />
      </FormGroup>
    );

    expect(queryByText('This is an error')).toBeNull();
  });
});
```

### Tokens: {'input_tokens': 1288, 'output_tokens': 1044}
### Execution time: 14.971922159194946
