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
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom redux-mock-store react-test-renderer
```

signup.test.js
```javascript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { reduxForm } from 'redux-form';
import * as api from '../api';
import * as actions from '../actions';
import Signup from './signup';

jest.mock('../api');
jest.mock('../actions');

const mockStore = configureStore([]);

const DecoratedSignup = reduxForm({
  form: 'signup',
  fields: ['name', 'email', 'password'],
  validate: () => ({}),
  asyncValidate: () => Promise.resolve({}),
  asyncBlurFields: ['name', 'email'],
})(Signup);


describe('Signup Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({ auth: {} });
    api.signup.mockResolvedValue({ data: {} });
    api.isName.mockResolvedValue({ data: false });
    api.isEmail.mockResolvedValue({ data: false });
    actions.signupComplete.mockReturnValue({});
  });

  it('renders the signup form', () => {
    render(
      <Provider store={store}>
        <DecoratedSignup />
      </Provider>
    );

    expect(screen.getByText('Join PodBaby today.')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Signup/i })).toBeInTheDocument();
  });

  it('validates form fields', async () => {
    render(
      <Provider store={store}>
        <DecoratedSignup />
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /Signup/i }));

    expect(screen.getByText('Name must be between 3 and 60 characters in length')).toBeInTheDocument();
    expect(screen.getByText('A valid email address is required')).toBeInTheDocument();
    expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
  });


  it('handles form submission', async () => {
    render(
      <Provider store={store}>
        <DecoratedSignup />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('Email address'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /Signup/i }));

    expect(api.signup).toHaveBeenCalledWith('Test User', 'test@example.com', 'password123');
    expect(actions.signupComplete).toHaveBeenCalled();
  });

  it('displays async validation errors', async () => {
    api.isName.mockResolvedValue({ data: true });
    api.isEmail.mockResolvedValue({ data: true });

    render(
      <Provider store={store}>
        <DecoratedSignup />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Test User' } });
    fireEvent.blur(screen.getByPlaceholderText('Name'));

    fireEvent.change(screen.getByPlaceholderText('Email address'), { target: { value: 'test@example.com' } });
    fireEvent.blur(screen.getByPlaceholderText('Email address'));

    await screen.findByText('This name is already in use');
    await screen.findByText('This email is already in use');

  });
});


```

form.test.js
```javascript
import React from 'react';
import { render } from '@testing-library/react';
import { FormGroup } from './form';

describe('FormGroup Component', () => {
  it('renders children', () => {
    const { container } = render(<FormGroup field={{ touched: false, error: null }}><input type="text" /></FormGroup>);
    expect(container.firstChild.firstChild).toMatchSnapshot();
  });

  it('renders with error style', () => {
    const { container } = render(<FormGroup field={{ touched: true, error: 'Error message' }}><input type="text" /></FormGroup>);
    expect(container.firstChild.firstChild).toMatchSnapshot();
    expect(container.querySelector('.help-block')).toHaveTextContent('Error message');
  });

  it('renders with success style', () => {
    const { container } = render(<FormGroup field={{ touched: true, error: null }}><input type="text" /></FormGroup>);
    expect(container.firstChild.firstChild).toMatchSnapshot();
  });
});

```

### Tokens: {'input_tokens': 1409, 'output_tokens': 1179}
### Execution time: 28.40007495880127
