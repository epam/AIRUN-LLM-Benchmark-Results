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
## Unit Tests for Signup Component

**Testing Libraries:**

*   Jest: For running tests and assertions.
*   React Testing Library: For interacting with React components.
*   Redux-mock-store: For mocking Redux store.

**Setup:**

1.  Install required dependencies:

```bash
npm install --save-dev jest @testing-library/react redux-mock-store
```

2.  Create a `jest.config.js` file in your project root:

```javascript
module.exports = {
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
};
```

**Test Files:**

**signup.test.js**

```javascript
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { Signup } from "./signup";
import * as api from "../api";

jest.mock("../api");

const mockStore = configureStore([]);

const initialValues = {
  name: "",
  email: "",
  password: "",
};

const setup = (store) => {
  const utils = render(
    <Provider store={store}>
      <Signup
        fields={{ name: {}, email: {}, password: {} }}
        handleSubmit={() => {}}
        submitting={false}
        asyncValidating={false}
        dispatch={() => {}}
      />
    </Provider>
  );
  const nameInput = utils.getByPlaceholderText("Name");
  const emailInput = utils.getByPlaceholderText("Email address");
  const passwordInput = utils.getByPlaceholderText("Password");
  const submitButton = utils.getByText("Signup");
  return { ...utils, nameInput, emailInput, passwordInput, submitButton };
};

describe("Signup component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({ form: { signup: { values: initialValues } } });
  });

  it("renders the signup form", () => {
    const { getByText } = setup(store);
    expect(getByText("Join PodBaby today.")).toBeInTheDocument();
  });

  it("validates name input", async () => {
    const { nameInput, getByText } = setup(store);
    fireEvent.change(nameInput, { target: { value: "ab" } });
    fireEvent.blur(nameInput);
    await waitFor(() => expect(getByText("Name must be between 3 and 60 characters in length")).toBeInTheDocument());
  });

  it("validates email input", async () => {
    const { emailInput, getByText } = setup(store);
    fireEvent.change(emailInput, { target: { value: "invalid_email" } });
    fireEvent.blur(emailInput);
    await waitFor(() => expect(getByText("A valid email address is required")).toBeInTheDocument());
  });

  it("validates password input", async () => {
    const { passwordInput, getByText } = setup(store);
    fireEvent.change(passwordInput, { target: { value: "12345" } });
    fireEvent.blur(passwordInput);
    await waitFor(() => expect(getByText("Password must be at least 6 characters")).toBeInTheDocument());
  });

  it("calls api.signup on submit", async () => {
    api.signup.mockResolvedValue({ data: {} });
    const { nameInput, emailInput, passwordInput, submitButton } = setup(store);
    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john.doe@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);
    await waitFor(() => expect(api.signup).toHaveBeenCalledWith("John Doe", "john.doe@example.com", "password123"));
  });
});

```

**form.test.js**

```javascript
import React from "react";
import { render } from "@testing-library/react";
import { FormGroup } from "./form";

describe("FormGroup component", () => {
  it("renders without errors", () => {
    const field = { touched: false, error: null };
    const { container } = render(<FormGroup field={field}><input type="text" /></FormGroup>);
    expect(container).toBeInTheDocument();
  });

  it("shows error message when field is touched and has error", () => {
    const field = { touched: true, error: "Error message" };
    const { getByText } = render(<FormGroup field={field}><input type="text" /></FormGroup>);
    expect(getByText("Error message")).toBeInTheDocument();
  });
});

``` 


### Tokens: {'input_tokens': 1407, 'output_tokens': 1120}
### Execution time: 32.354832887649536
