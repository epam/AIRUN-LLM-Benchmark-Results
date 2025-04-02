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
  "devDependencies": {
    "enzyme": "^3.11.0",
    "enzyme-adapter-react-16": "^1.15.6",
    "jest": "^26.6.3",
    "react-test-renderer": "^17.0.2",
    "redux-mock-store": "^1.5.4",
    "sinon": "^10.0.0"
  }
}
```

```js
// setupTests.js
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
```

```js
// signup.test.js
import React from 'react';
import { shallow, mount } from 'enzyme';
import { reduxForm } from 'redux-form';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import validator from 'validator';
import { Signup, validate, asyncValidate } from './signup';
import { FormGroup } from './form';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Signup Component', () => {
  let store;
  let props;
  let wrapper;

  beforeEach(() => {
    store = mockStore({});
    props = {
      fields: {
        name: { touched: false, error: undefined },
        email: { touched: false, error: undefined },
        password: { touched: false, error: undefined },
      },
      handleSubmit: jest.fn(),
      submitting: false,
      asyncValidating: false,
      dispatch: jest.fn(),
    };
    wrapper = shallow(<Signup {...props} />);
  });

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('renders form fields', () => {
    expect(wrapper.find(FormGroup).length).toBe(3);
  });

  it('renders submit button', () => {
    expect(wrapper.find('Button').length).toBe(1);
  });

  it('renders login link', () => {
    expect(wrapper.find('Link').length).toBe(1);
  });

  it('should validate name correctly', () => {
    expect(validate({ name: 'a' })).toEqual({ name: 'Name must be between 3 and 60 characters in length' });
    expect(validate({ name: 'abc' })).toEqual({});
    expect(validate({ name: 'a'.repeat(61) })).toEqual({ name: 'Name must be between 3 and 60 characters in length' });
  });

  it('should validate email correctly', () => {
    expect(validate({ email: 'invalid-email' })).toEqual({ email: 'A valid email address is required' });
    expect(validate({ email: 'valid@example.com' })).toEqual({});
  });

  it('should validate password correctly', () => {
    expect(validate({ password: '12345' })).toEqual({ password: 'Password must be at least 6 characters' });
    expect(validate({ password: '123456' })).toEqual({});
  });

  it('should async validate name correctly', async () => {
    sinon.stub(api, 'isName').returns(Promise.resolve({ data: true }));
    const result = await asyncValidate({ name: 'takenName' });
    expect(result).toEqual({ name: 'This name is already in use' });
    api.isName.restore();
  });

  it('should async validate email correctly', async () => {
    sinon.stub(api, 'isEmail').returns(Promise.resolve({ data: true }));
    const result = await asyncValidate({ email: 'takenEmail@example.com' });
    expect(result).toEqual({ email: 'This email is already in use' });
    api.isEmail.restore();
  });

  it('should handle form submission', async () => {
    sinon.stub(api, 'signup').returns(Promise.resolve({ data: 'success' }));
    const handleSubmit = wrapper.instance().handleSubmit;
    await handleSubmit({ name: 'test', email: 'test@example.com', password: 'password123' });
    expect(api.signup.calledOnce).toBe(true);
    api.signup.restore();
  });
});
```

```js
// form.test.js
import React from 'react';
import { shallow } from 'enzyme';
import { FormGroup } from './form';

describe('FormGroup Component', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      field: {
        touched: false,
        error: undefined,
      },
      children: <input type="text" />,
    };
    wrapper = shallow(<FormGroup {...props} />);
  });

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('renders children', () => {
    expect(wrapper.find('input').length).toBe(1);
  });

  it('renders error message when field is touched and has error', () => {
    wrapper.setProps({ field: { touched: true, error: 'Error message' } });
    expect(wrapper.find('.help-block').text()).toBe('Error message');
  });

  it('does not render error message when field is not touched', () => {
    wrapper.setProps({ field: { touched: false, error: 'Error message' } });
    expect(wrapper.find('.help-block').length).toBe(0);
  });

  it('does not render error message when field is touched but has no error', () => {
    wrapper.setProps({ field: { touched: true, error: undefined } });
    expect(wrapper.find('.help-block').length).toBe(0);
  });
});
```

### Tokens: {'input_tokens': 1186, 'output_tokens': 1191}
### Execution time: 13.327124118804932
