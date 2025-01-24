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
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { Signup, __RewireAPI__ as SignupRewireAPI } from '../signup';
import { FormGroup } from '../components/form';
import * as api from '../api';
import { auth } from '../actions';
import { createStore, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import DocumentTitle from 'react-document-title';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router';

describe('Signup', () => {
  let store, wrapper, actions, sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    actions = {
      signupComplete: sandbox.spy(),
    };
    SignupRewireAPI.__Rewire__('auth', actions);

    store = createStore(combineReducers({ form: formReducer }));

    wrapper = mount(
      <Provider store={store}>
        <Signup dispatch={() => {}} />
      </Provider>
    );
  });

  afterEach(() => {
    sandbox.restore();
    SignupRewireAPI.__ResetDependency__('auth');
  });

  it('should render the component', () => {
    expect(wrapper.find(Signup)).to.have.length(1);
    expect(wrapper.find(DocumentTitle)).to.have.length(1);
    expect(wrapper.find('h2').text()).to.equal('Join PodBaby today.');
    expect(wrapper.find(FormGroup)).to.have.length(3);
    expect(wrapper.find(Button)).to.have.length(1);
    expect(wrapper.find(Link)).to.have.length(1);
  });

  it('should validate name field', () => {
    const nameField = wrapper.find(FormGroup).at(0);
    const input = nameField.find('input');
    input.simulate('change', { target: { value: 'a' } });
    input.simulate('blur');
    expect(nameField.find('.help-block').text()).to.equal(
      'Name must be between 3 and 60 characters in length'
    );
  });

  it('should validate email field', () => {
    const emailField = wrapper.find(FormGroup).at(1);
    const input = emailField.find('input');
    input.simulate('change', { target: { value: 'invalid-email' } });
    input.simulate('blur');
    expect(emailField.find('.help-block').text()).to.equal(
      'A valid email address is required'
    );
  });

  it('should validate password field', () => {
    const passwordField = wrapper.find(FormGroup).at(2);
    const input = passwordField.find('input');
    input.simulate('change', { target: { value: 'pass' } });
    input.simulate('blur');
    expect(passwordField.find('.help-block').text()).to.equal(
      'Password must be at least 6 characters'
    );
  });

  it('should handle form submission', async () => {
    const signupStub = sandbox.stub(api, 'signup').resolves({ data: {} });
    const nameInput = wrapper.find('input').at(0);
    const emailInput = wrapper.find('input').at(1);
    const passwordInput = wrapper.find('input').at(2);

    nameInput.simulate('change', { target: { value: 'Test User' } });
    emailInput.simulate('change', { target: { value: 'test@example.com' } });
    passwordInput.simulate('change', { target: { value: 'password123' } });

    wrapper.find('form').simulate('submit');

    await signupStub;

    expect(signupStub.calledOnce).to.be.true;
    expect(
      signupStub.calledWith('Test User', 'test@example.com', 'password123')
    ).to.be.true;
    expect(actions.signupComplete.calledOnce).to.be.true;
  });

  it('should handle form submission error', async () => {
    const signupStub = sandbox.stub(api, 'signup').rejects({ data: 'Error' });
    const nameInput = wrapper.find('input').at(0);
    const emailInput = wrapper.find('input').at(1);
    const passwordInput = wrapper.find('input').at(2);

    nameInput.simulate('change', { target: { value: 'Test User' } });
    emailInput.simulate('change', { target: { value: 'test@example.com' } });
    passwordInput.simulate('change', { target: { value: 'password123' } });

    wrapper.find('form').simulate('submit');

    try {
      await signupStub;
    } catch (error) {}

    expect(signupStub.calledOnce).to.be.true;
    expect(actions.signupComplete.called).to.be.false;
  });

  it('should async validate name', async () => {
    const isNameStub = sandbox.stub(api, 'isName').resolves({ data: true });
    const nameInput = wrapper.find('input').at(0);

    nameInput.simulate('change', { target: { value: 'Test User' } });
    nameInput.simulate('blur');

    await isNameStub;

    expect(isNameStub.calledOnce).to.be.true;
    expect(isNameStub.calledWith('Test User')).to.be.true;
    expect(wrapper.find(FormGroup).at(0).find('.help-block').text()).to.equal(
      'This name is already in use'
    );
  });

  it('should async validate email', async () => {
    const isEmailStub = sandbox.stub(api, 'isEmail').resolves({ data: true });
    const emailInput = wrapper.find('input').at(1);

    emailInput.simulate('change', { target: { value: 'test@example.com' } });
    emailInput.simulate('blur');

    await isEmailStub;

    expect(isEmailStub.calledOnce).to.be.true;
    expect(isEmailStub.calledWith('test@example.com')).to.be.true;
    expect(
      wrapper.find(FormGroup).at(1).find('.help-block').text()
    ).to.equal('This email is already in use');
  });
});

describe('FormGroup', () => {
  it('should render the component', () => {
    const field = {
      touched: false,
      error: null,
    };
    const wrapper = mount(
      <FormGroup field={field}>
        <input type="text" />
      </FormGroup>
    );
    expect(wrapper.find('input')).to.have.length(1);
    expect(wrapper.find('.help-block')).to.have.length(0);
  });

  it('should show error message', () => {
    const field = {
      touched: true,
      error: 'Error message',
    };
    const wrapper = mount(
      <FormGroup field={field}>
        <input type="text" />
      </FormGroup>
    );
    expect(wrapper.find('.help-block')).to.have.length(1);
    expect(wrapper.find('.help-block').text()).to.equal('Error message');
  });

  it('should show success style', () => {
    const field = {
      touched: true,
      error: null,
    };
    const wrapper = mount(
      <FormGroup field={field}>
        <input type="text" />
      </FormGroup>
    );
    expect(wrapper.find('.has-success')).to.have.length(1);
  });

  it('should show error style', () => {
    const field = {
      touched: true,
      error: 'Error message',
    };
    const wrapper = mount(
      <FormGroup field={field}>
        <input type="text" />
      </FormGroup>
    );
    expect(wrapper.find('.has-error')).to.have.length(1);
  });
});
```

### Tokens: {'input_tokens': 1409, 'output_tokens': 1983}
### Execution time: 47.008601903915405
