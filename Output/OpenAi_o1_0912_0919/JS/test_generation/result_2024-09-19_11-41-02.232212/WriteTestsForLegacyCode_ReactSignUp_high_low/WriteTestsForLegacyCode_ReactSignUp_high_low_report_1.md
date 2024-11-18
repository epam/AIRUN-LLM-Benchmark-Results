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
// __tests__/form.test.js

import React from 'react';
import { render } from '@testing-library/react';
import { FormGroup } from '../form';

describe('FormGroup component', () => {
  const renderFormGroup = (fieldProps) => {
    return render(
      <FormGroup field={fieldProps}>
        <input type="text" />
      </FormGroup>
    );
  };

  it('renders without crashing', () => {
    const field = { touched: false, error: null };
    const { getByRole } = renderFormGroup(field);
    expect(getByRole('textbox')).toBeInTheDocument();
  });

  it('does not display feedback when field is untouched', () => {
    const field = { touched: false, error: null };
    const { container } = renderFormGroup(field);
    expect(container.querySelector('.has-success')).not.toBeInTheDocument();
    expect(container.querySelector('.has-error')).not.toBeInTheDocument();
  });

  it('shows success style when field is touched and has no error', () => {
    const field = { touched: true, error: null };
    const { container } = renderFormGroup(field);
    expect(container.querySelector('.has-success')).toBeInTheDocument();
  });

  it('shows error style and displays error message when field is touched and has error', () => {
    const field = { touched: true, error: 'Error message' };
    const { container, getByText } = renderFormGroup(field);
    expect(container.querySelector('.has-error')).toBeInTheDocument();
    expect(getByText('Error message')).toBeInTheDocument();
  });
});
```

```js
// __tests__/signup.test.js

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Signup, validate, asyncValidate } from '../signup';
import * as api from '../api';
import * as authActions from '../actions/auth';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

jest.mock('../api');
jest.mock('../actions/auth');

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Signup component', () => {
  let store;
  let props;

  beforeEach(() => {
    store = mockStore({});
    props = {
      fields: {
        name: { value: '', touched: false, error: null },
        email: { value: '', touched: false, error: null },
        password: { value: '', touched: false, error: null },
      },
      handleSubmit: jest.fn(fn => () => fn()),
      submitting: false,
      asyncValidating: false,
      dispatch: store.dispatch,
    };
  });

  it('renders without crashing', () => {
    render(
      <Provider store={store}>
        <Signup {...props} />
      </Provider>
    );
  });

  it('calls handleSubmit on form submit', () => {
    const { getByRole } = render(
      <Provider store={store}>
        <Signup {...props} />
      </Provider>
    );

    fireEvent.click(getByRole('button', { name: /Signup/i }));
    expect(props.handleSubmit).toHaveBeenCalled();
  });

  it('handleSubmit calls api.signup and dispatches signupComplete', async () => {
    api.signup.mockResolvedValue({ data: { user: 'test user' } });
    authActions.signupComplete = jest.fn();

    const component = new Signup(props);
    const values = { name: 'Test', email: 'test@example.com', password: 'password' };
    await component.handleSubmit(values);

    expect(api.signup).toHaveBeenCalledWith('Test', 'test@example.com', 'password');
    expect(authActions.signupComplete).toHaveBeenCalledWith({ user: 'test user' });
  });

  it('handleSubmit handles api.signup error', async () => {
    api.signup.mockRejectedValue({ data: { error: 'Signup error' } });

    const component = new Signup(props);
    const values = { name: 'Test', email: 'test@example.com', password: 'password' };
    try {
      await component.handleSubmit(values);
    } catch (error) {
      expect(error).toEqual({ error: 'Signup error' });
    }
  });
});

describe('validate function', () => {
  it('returns no errors for valid input', () => {
    const values = {
      name: 'Valid Name',
      email: 'valid@example.com',
      password: 'password123',
    };
    const errors = validate(values);
    expect(errors).toEqual({});
  });

  it('returns errors for invalid input', () => {
    const values = {
      name: 'No',
      email: 'invalid-email',
      password: '123',
    };
    const errors = validate(values);
    expect(errors.name).toBeDefined();
    expect(errors.email).toBeDefined();
    expect(errors.password).toBeDefined();
  });
});

describe('asyncValidate function', () => {
  beforeEach(() => {
    api.isName.mockClear();
    api.isEmail.mockClear();
  });

  it('returns no errors when name and email are available', async () => {
    api.isName.mockResolvedValue({ data: false });
    api.isEmail.mockResolvedValue({ data: false });

    const values = { name: 'UniqueName', email: 'unique@example.com' };
    const errors = await asyncValidate(values);

    expect(api.isName).toHaveBeenCalledWith('UniqueName');
    expect(api.isEmail).toHaveBeenCalledWith('unique@example.com');
    expect(errors).toEqual({});
  });

  it('returns errors when name and email are already in use', async () => {
    api.isName.mockResolvedValue({ data: true });
    api.isEmail.mockResolvedValue({ data: true });

    const values = { name: 'ExistingName', email: 'existing@example.com' };
    const errors = await asyncValidate(values);

    expect(api.isName).toHaveBeenCalledWith('ExistingName');
    expect(api.isEmail).toHaveBeenCalledWith('existing@example.com');
    expect(errors).toEqual({
      name: 'This name is already in use',
      email: 'This email is already in use',
    });
  });
});
```

### Tokens: {'input_tokens': 1259, 'output_tokens': 4939, 'reasoning_tokens': 3584}
### Execution time: 52.59731912612915
