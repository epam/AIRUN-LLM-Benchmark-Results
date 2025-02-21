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
import { Signup } from '../signup';
import { reduxForm } from 'redux-form';
import * as api from '../api';
import sinon from 'sinon';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import { FormGroup } from '../components/form';
import { Button } from 'react-bootstrap';

configure({ adapter: new Adapter() });

describe('Signup Component', () => {
  let store;
  let handleSubmit;
  let wrapper;
  let actions;
  let dispatch;

  const mockStore = (state) => ({
    dispatch: sinon.spy(),
    subscribe: () => {},
    getState: () => state,
  });

  const props = {
    fields: {
      name: {
        value: '',
        touched: false,
        error: null,
      },
      email: {
        value: '',
        touched: false,
        error: null,
      },
      password: {
        value: '',
        touched: false,
        error: null,
      },
    },
    handleSubmit: fn => fn,
    submitting: false,
    asyncValidating: false,
    dispatch: sinon.spy(),
  };

    beforeEach(() => {
        dispatch = sinon.spy();
        actions = {
            signupComplete: sinon.spy(),
        };

        handleSubmit = sinon.spy();

        store = mockStore({});

        wrapper = mount(
            <Provider store={store}>
                <Signup {...props} dispatch={dispatch} />
            </Provider>
        );
    });

  it('should render the component', () => {
    expect(wrapper.find(Signup)).to.have.length(1);
  });

  it('should render the form', () => {
    expect(wrapper.find('form')).to.have.length(1);
  });

  it('should render name, email, and password fields', () => {
    expect(wrapper.find('input[type="text"]').props().placeholder).to.equal('Name');
    expect(wrapper.find('input[type="email"]').props().placeholder).to.equal('Email address');
    expect(wrapper.find('input[type="password"]').props().placeholder).to.equal('Password');
  });

  it('should render submit button', () => {
      expect(wrapper.find(Button).length).to.equal(1);
  });

    it('should call handleSubmit when form is submitted', () => {
        const signupStub = sinon.stub(api, 'signup').resolves({ data: {} });
        const handleSubmit = fn => {
            return (values) => {
                return fn(values);
            }
        };

        const component = mount(<Signup {...{...props, handleSubmit}} dispatch={dispatch} />);

        component.find('form').simulate('submit');
        expect(dispatch.called).to.equal(false);
        signupStub.restore();
    });

    it('should handle submit success', (done) => {
      const signupStub = sinon.stub(api, 'signup').resolves({ data: { id: 1 } });
      const actions = { signupComplete: sinon.spy() };
      const dispatch = sinon.spy((action) => {
          if (typeof action === 'function') {
              return action(dispatch, () => ({}));
          }
      });

      const handleSubmit = (fn) => (values) => fn(values);

      const component = mount(<Signup {...{...props, dispatch, handleSubmit}} />);
      const instance = component.find(Signup).instance();
      instance.actions = actions;

      instance.handleSubmit({ name: 'test', email: 'test@test.com', password: 'password' })
        .then(() => {
          expect(signupStub.calledWith('test', 'test@test.com', 'password')).to.be.true;
          expect(actions.signupComplete.calledOnce).to.be.true;
          expect(actions.signupComplete.calledWith({ id: 1 })).to.be.true;
          done();
        })
        .catch(done);

      signupStub.restore();
    });

    it('should handle submit failure', (done) => {
        const signupStub = sinon.stub(api, 'signup').rejects({ data: { error: 'error' } });
        const handleSubmit = (fn) => (values) => fn(values);
        const component = mount(<Signup {...{...props, handleSubmit}} dispatch={dispatch}/>);
        const instance = component.find(Signup).instance();

        instance.handleSubmit({ name: 'test', email: 'test@test.com', password: 'password' })
          .catch(error => {
            expect(signupStub.calledWith('test', 'test@test.com', 'password')).to.be.true;
            expect(error).to.eql({ error: 'error' });
            done();
          });

        signupStub.restore();
    });
});

describe('FormGroup Component', () => {
    it('should render children', () => {
        const field = { touched: false, error: null };
        const wrapper = mount(<FormGroup field={field}><div>Test</div></FormGroup>);
        expect(wrapper.contains(<div>Test</div>)).to.equal(true);
    });

    it('should show error style and message if touched and error', () => {
        const field = { touched: true, error: 'Required' };
        const wrapper = mount(
            <FormGroup field={field}>
                <input type="text" />
            </FormGroup>
        );
        expect(wrapper.find('.help-block').text()).to.equal('Required');
        expect(wrapper.props().bsStyle).to.equal('error');
    });

    it('should show success style if touched and no error', () => {
        const field = { touched: true, error: null };
        const wrapper = mount(
            <FormGroup field={field}>
                <input type="text" />
            </FormGroup>);
        expect(wrapper.props().bsStyle).to.equal('success');
    });
});

describe('validate function', () => {
    it('should return error if name length is less than 3', () => {
        const values = { name: 'ab', email: 'test@test.com', password: 'password' };
        const { validate } = require('../signup');
        expect(validate(values).name).to.equal('Name must be between 3 and 60 characters in length');
    });

    it('should return error if name length is greater than 60', () => {
        const values = { name: 'a'.repeat(61), email: 'test@test.com', password: 'password' };
        const { validate } = require('../signup');
        expect(validate(values).name).to.equal('Name must be between 3 and 60 characters in length');
    });

    it('should return error if email is invalid', () => {
        const values = { name: 'abc', email: 'test', password: 'password' };
        const { validate } = require('../signup');
        expect(validate(values).email).to.equal('A valid email address is required');
    });

    it('should return error if password length is less than 6', () => {
        const values = { name: 'abc', email: 'test@test.com', password: 'pass' };
        const { validate } = require('../signup');
        expect(validate(values).password).to.equal('Password must be at least 6 characters');
    });

    it('should return empty object if no errors', () => {
        const values = { name: 'abc', email: 'test@test.com', password: 'password' };
        const { validate } = require('../signup');
        expect(validate(values)).to.eql({});
    });
});

describe('asyncValidate function', () => {
    it('should return error if email already exists', (done) => {
        const isEmailStub = sinon.stub(api, 'isEmail').resolves({ data: true });
        const { asyncValidate } = require('../signup');
        asyncValidate({ email: 'test@test.com' })
            .then(errors => {
                expect(errors).to.eql({ email: 'This email is already in use' });
                isEmailStub.restore();
                done();
            });
    });

    it('should return error if name already exists', (done) => {
        const isNameStub = sinon.stub(api, 'isName').resolves({ data: true });
        const { asyncValidate } = require('../signup');
        asyncValidate({ name: 'test' })
            .then(errors => {
                expect(errors).to.eql({ name: 'This name is already in use' });
                isNameStub.restore();
                done();
            });
    });

    it('should return empty object if no errors', (done) => {
        const isEmailStub = sinon.stub(api, 'isEmail').resolves({ data: false });
        const isNameStub = sinon.stub(api, 'isName').resolves({ data: false });
        const { asyncValidate } = require('../signup');
        asyncValidate({ name: 'test', email: 'test@test.com' })
            .then(errors => {
                expect(errors).to.eql({});
                isEmailStub.restore();
                isNameStub.restore();
                done();
            });
    });

    it('should return both errors if both exist', (done) => {
        const isEmailStub = sinon.stub(api, 'isEmail').resolves({ data: true });
        const isNameStub = sinon.stub(api, 'isName').resolves({ data: true });
        const { asyncValidate } = require('../signup');
        asyncValidate({ name: 'test', email: 'test@test.com' })
            .then(errors => {
                expect(errors).to.eql({
                    email: 'This email is already in use',
                    name: 'This name is already in use',
                });
                isEmailStub.restore();
                isNameStub.restore();
                done();
            });
    });
});
```

### Tokens: {'input_tokens': 1409, 'output_tokens': 2428}
### Execution time: 23.25785803794861
