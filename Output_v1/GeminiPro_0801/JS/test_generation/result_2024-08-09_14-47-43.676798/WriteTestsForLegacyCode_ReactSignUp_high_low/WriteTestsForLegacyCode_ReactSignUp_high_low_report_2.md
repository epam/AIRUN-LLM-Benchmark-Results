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
## Run 2:
### Answer:
```javascript
import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { reduxForm } from 'redux-form';

import * as api from '../api';
import { Signup } from './signup';
import { FormGroup } from '../components/form';

const mockApi = {
  isName: () => Promise.resolve({ data: false }),
  isEmail: () => Promise.resolve({ data: false }),
  signup: () => Promise.resolve({ data: {} }),
};

const createComponent = (props, shallowRender = true) => {
  const handleSubmit = sinon.spy();
  const dispatch = sinon.spy();

  const propsWithDefaults = {
    fields: {
      name: { value: '', touched: false, error: '' },
      email: { value: '', touched: false, error: '' },
      password: { value: '', touched: false, error: '' },
    },
    handleSubmit,
    submitting: false,
    asyncValidating: false,
    dispatch,
    ...props,
  };

  const Decorated = reduxForm({
    form: 'testSignup',
    fields: ['name', 'email', 'password'],
  })(Signup);

  const store = createStore((state = {}) => state, applyMiddleware(thunk));

  if (shallowRender) {
    return shallow(
      <Provider store={store}>
        <Decorated {...propsWithDefaults} />
      </Provider>
    ).dive().dive();
  }

  return mount(
    <Provider store={store}>
      <Decorated {...propsWithDefaults} />
    </Provider>
  );
};

describe('<Signup />', () => {
  it('should render signup form', () => {
    const comp = createComponent();
    expect(comp.find('form')).to.have.length(1);
    expect(comp.find('input[type="text"]')).to.have.length(1);
    expect(comp.find('input[type="email"]')).to.have.length(1);
    expect(comp.find('input[type="password"]')).to.have.length(1);
    expect(comp.find('Button[type="submit"]')).to.have.length(1);
  });

  it('should show errors', () => {
    const comp = createComponent({
      fields: {
        name: { value: '', touched: true, error: 'Name is required' },
        email: { value: '', touched: true, error: 'Email is required' },
        password: { value: '', touched: true, error: 'Password is required' },
      },
    });

    expect(comp.find(FormGroup).at(0).props().field.error).to.equal('Name is required');
    expect(comp.find(FormGroup).at(1).props().field.error).to.equal('Email is required');
    expect(comp.find(FormGroup).at(2).props().field.error).to.equal('Password is required');
  });

  it('should call onSubmit', () => {
    const comp = createComponent();
    comp.find('form').simulate('submit');
    expect(comp.props().handleSubmit.called).to.be.true;
  });

  describe('handleSubmit', () => {
    let sandbox;

    beforeEach(() => {
      sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should signup user', () => {
      const signup = sandbox.stub(api, 'signup').returns(Promise.resolve({ data: {} }));
      const signupComplete = sinon.spy();
      const comp = createComponent({ actions: { signupComplete } }, false);

      return comp.find('form').simulate('submit')
        .then(() => {
          const values = { name: 'name', email: 'email', password: 'password' };
          expect(signup.calledWith(values.name, values.email, values.password)).to.be.true;
          expect(signupComplete.called).to.be.true;
        });
    });
  });
});

```

### Tokens: {'input_tokens': 1407, 'output_tokens': 998}
### Execution time: 21.36396312713623
