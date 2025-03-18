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
import React from 'react';
import { render, screen } from '@testing-library/react';
import { FormGroup } from '../form';

jest.mock('react-bootstrap', () => ({
  Input: ({ children, hasFeedback, bsStyle }) => (
    <div>
      <div data-testid="input" data-bsstyle={bsStyle} data-hasfeedback={hasFeedback}>
        {children}
      </div>
    </div>
  ),
}));

describe('FormGroup', () => {
  it('renders children without error or feedback when field is not touched', () => {
    const field = { touched: false, error: null };
    render(
      <FormGroup field={field}>
        <span>Test Child</span>
      </FormGroup>
    );
    const inputElement = screen.getByTestId('input');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('data-bsstyle', undefined);
    expect(inputElement).toHaveAttribute('data-hasfeedback', 'false');
    expect(screen.getByText('Test Child')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders children with success style and feedback when field is touched and no error', () => {
    const field = { touched: true, error: null };
    render(
      <FormGroup field={field}>
        <span>Test Child</span>
      </FormGroup>
    );
    const inputElement = screen.getByTestId('input');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('data-bsstyle', 'success');
    expect(inputElement).toHaveAttribute('data-hasfeedback', 'true');
    expect(screen.getByText('Test Child')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders children with error style, feedback and error message when field is touched and has error', () => {
    const field = { touched: true, error: 'Test Error' };
    render(
      <FormGroup field={field}>
        <span>Test Child</span>
      </FormGroup>
    );
    const inputElement = screen.getByTestId('input');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('data-bsstyle', 'error');
    expect(inputElement).toHaveAttribute('data-hasfeedback', 'true');
    expect(screen.getByText('Test Child')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('help-block');
    expect(screen.getByText('Test Error')).toBeInTheDocument();
  });
});
```

```javascript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Signup, validate, asyncValidate } from '../signup';
import * as api from '../api';

jest.mock('react-document-title', () => ({ children }) => <>{children}</>);
jest.mock('react-router', () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));
jest.mock('../components/icon', () => () => <i />);
jest.mock('../components/form', () => ({
  FormGroup: ({ children }) => <div>{children}</div>,
}));
jest.mock('react-bootstrap', () => ({
  Button: ({ children, onClick, disabled, type, className }) => (
    <button disabled={disabled} onClick={onClick} type={type} className={className}>
      {children}
    </button>
  ),
}));
jest.mock('redux-form', () => ({
  reduxForm: () => (WrappedComponent) => (props) => (
    <WrappedComponent
      {...props}
      fields={{
        name: { input: { value: '', onChange: jest.fn() }, meta: { touched: false, error: null } },
        email: { input: { value: '', onChange: jest.fn() }, meta: { touched: false, error: null } },
        password: { input: { value: '', onChange: jest.fn() }, meta: { touched: false, error: null } },
      }}
      handleSubmit={(fn) => (event) => {
        event.preventDefault();
        return fn();
      }}
      submitting={false}
      asyncValidating={false}
    />
  ),
  Field: () => <input />,
}));
jest.mock('../api', () => ({
  isName: jest.fn(),
  isEmail: jest.fn(),
  signup: jest.fn(),
}));
jest.mock('../actions', () => ({
  auth: {
    signupComplete: jest.fn(),
  },
}));
jest.mock('redux', () => ({
  bindActionCreators: (actions, dispatch) => actions,
}));

describe('Signup Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Validation', () => {
    it('validate function returns empty object for valid input', () => {
      const values = { name: 'Valid Name', email: 'valid@email.com', password: 'password123' };
      expect(validate(values)).toEqual({});
    });

    it('validate function returns error for invalid name', () => {
      let values = { name: '', email: 'valid@email.com', password: 'password123' };
      expect(validate(values)).toHaveProperty('name');
      values = { name: 'ab', email: 'valid@email.com', password: 'password123' };
      expect(validate(values)).toHaveProperty('name');
      values = { name: 'VeryLongNameeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', email: 'valid@email.com', password: 'password123' };
      expect(validate(values)).toHaveProperty('name');
    });

    it('validate function returns error for invalid email', () => {
      let values = { name: 'Valid Name', email: '', password: 'password123' };
      expect(validate(values)).toHaveProperty('email');
      values = { name: 'Valid Name', email: 'invalid-email', password: 'password123' };
      expect(validate(values)).toHaveProperty('email');
    });

    it('validate function returns error for invalid password', () => {
      let values = { name: 'Valid Name', email: 'valid@email.com', password: '' };
      expect(validate(values)).toHaveProperty('password');
      values = { name: 'Valid Name', email: 'valid@email.com', password: 'short' };
      expect(validate(values)).toHaveProperty('password');
    });
  });

  describe('Async Validation', () => {
    it('asyncValidate resolves empty object when name and email are available', async () => {
      api.isName.mockResolvedValue({ data: null });
      api.isEmail.mockResolvedValue({ data: null });
      await expect(asyncValidate({ name: 'NewName', email: 'new@email.com' })).resolves.toEqual({});
      expect(api.isName).toHaveBeenCalled();
      expect(api.isEmail).toHaveBeenCalled();
    });

    it('asyncValidate resolves with name error when name is taken', async () => {
      api.isName.mockResolvedValue({ data: true });
      api.isEmail.mockResolvedValue({ data: null });
      await expect(asyncValidate({ name: 'TakenName', email: 'new@email.com' })).resolves.toEqual({ name: 'This name is already in use' });
      expect(api.isName).toHaveBeenCalled();
      expect(api.isEmail).toHaveBeenCalled();
    });

    it('asyncValidate resolves with email error when email is taken', async () => {
      api.isName.mockResolvedValue({ data: null });
      api.isEmail.mockResolvedValue({ data: true });
      await expect(asyncValidate({ name: 'NewName', email: 'taken@email.com' })).resolves.toEqual({ email: 'This email is already in use' });
      expect(api.isName).toHaveBeenCalled();
      expect(api.isEmail).toHaveBeenCalled();
    });

    it('asyncValidate resolves with both errors when name and email are taken', async () => {
      api.isName.mockResolvedValue({ data: true });
      api.isEmail.mockResolvedValue({ data: true });
      await expect(asyncValidate({ name: 'TakenName', email: 'taken@email.com' })).resolves.toEqual({ name: 'This name is already in use', email: 'This email is already in use' });
      expect(api.isName).toHaveBeenCalled();
      expect(api.isEmail).toHaveBeenCalled();
    });
  });

  describe('handleSubmit', () => {
    it('handleSubmit calls signup api and signupComplete action on success', async () => {
      const signupComplete = jest.fn();
      const actions = { signupComplete };
      const dispatch = jest.fn();
      const componentProps = { dispatch };
      const component = new Signup(componentProps);
      component.actions = actions;
      const values = { name: 'Test Name', email: 'test@email.com', password: 'password123' };
      api.signup.mockResolvedValue({ data: { token: 'test-token' } });

      await component.handleSubmit(values);

      expect(api.signup).toHaveBeenCalledWith('Test Name', 'test@email.com', 'password123');
      expect(signupComplete).toHaveBeenCalledWith({ token: 'test-token' });
    });

    it('handleSubmit rejects promise on api error', async () => {
      const signupComplete = jest.fn();
      const actions = { signupComplete };
      const dispatch = jest.fn();
      const componentProps = { dispatch };
      const component = new Signup(componentProps);
      component.actions = actions;
      const values = { name: 'Test Name', email: 'test@email.com', password: 'password123' };
      api.signup.mockRejectedValue({ data: { error: 'Signup failed' } });

      await expect(component.handleSubmit(values)).rejects.toEqual({ error: 'Signup failed' });

      expect(api.signup).toHaveBeenCalledWith('Test Name', 'test@email.com', 'password123');
      expect(signupComplete).not.toHaveBeenCalled();
    });
  });

  describe('Rendering', () => {
    it('renders signup form', () => {
      render(<Signup dispatch={jest.fn()} submitting={false} asyncValidating={false} fields={{
        name: { input: { value: '', onChange: jest.fn() }, meta: { touched: false, error: null } },
        email: { input: { value: '', onChange: jest.fn() }, meta: { touched: false, error: null } },
        password: { input: { value: '', onChange: jest.fn() }, meta: { touched: false, error: null } },
      }} handleSubmit={f => f} />);
      expect(screen.getByRole('heading', { level: 2, name: /Join PodBaby today./i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Signup/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Already a member\?/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    });

    it('calls handleSubmit on form submission', async () => {
      const handleSubmitMock = jest.fn();
      render(<Signup dispatch={jest.fn()} submitting={false} asyncValidating={false} fields={{
        name: { input: { value: '', onChange: jest.fn() }, meta: { touched: false, error: null } },
        email: { input: { value: '', onChange: jest.fn() }, meta: { touched: false, error: null } },
        password: { input: { value: '', onChange: jest.fn() }, meta: { touched: false, error: null } },
      }} handleSubmit={handleSubmitMock} />);
      const submitButton = screen.getByRole('button', { name: /Signup/i });
      fireEvent.click(submitButton);
      await waitFor(() => {
        expect(handleSubmitMock).toHaveBeenCalled();
      });
    });
  });
});
```

### Tokens: {'input_tokens': 1409, 'output_tokens': 2946}
### Execution time: 14.641456127166748
