Your task is to write unit-tests for a legacy part of frontend application.

navbar.js
```js
import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import {
  Nav,
  NavItem,
  Navbar,
  NavDropdown,
  MenuItem,
} from 'react-bootstrap';

import Gravatar from './gravatar';
import Icon from './icon';

class NavBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = { expanded: false };

    this.handleSelected = this.handleSelected.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleOpenAddChannelForm = this.handleOpenAddChannelForm.bind(this);
  }

  handleToggle() {
    this.setState({ expanded: !this.state.expanded });
  }

  handleSelected() {
    this.setState({ expanded: false });
  }

  handleOpenAddChannelForm(event) {
    this.props.onOpenAddChannelForm(event);
    this.handleSelected();
  }

  render() {
    const { isLoggedIn, name, email } = this.props.auth;
    const { createHref, isActive } = this.props.router;

    const dropdownTitle = isLoggedIn ? <span><Gravatar email={email} /> {name}</span> : '';

    return (
      <Navbar fixedTop
        expanded={this.state.expanded}
        onToggle={this.handleToggle}
      >
        <Navbar.Header>
          <Navbar.Brand>
            <Link style={{ fontFamily: 'GoodDog' }} to="/"><Icon icon="headphones" /> PodBaby</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>

        <Navbar.Collapse>
          <Nav pullLeft>
            <NavItem
              active={isActive('/new/')}
              href={createHref('/new/')}
              onClick={this.handleSelected}
            ><Icon icon="flash" /> New episodes
            </NavItem>
            <NavItem
              active={isActive('/browse/')}
              href={createHref('/browse/')}
              onClick={this.handleSelected}
            ><Icon icon="list" /> Browse
            </NavItem>
            <NavItem
              active={isActive('/search/')}
              href={createHref('/search/')}
              onClick={this.handleSelected}
            ><Icon icon="search" /> Search
            </NavItem>
            <NavItem
              active={isActive('/recommendations/')}
              href={createHref('/recommendations/')}
              onClick={this.handleSelected}
            ><Icon icon="thumbs-up" /> Recommended
            </NavItem>
          </Nav>
          {isLoggedIn ?
          <Nav pullLeft>
            <NavItem
              onClick={this.handleOpenAddChannelForm}
              href="#"
            ><Icon icon="rss" /> Add new feed
            </NavItem>
          </Nav>
          : ''}

          {isLoggedIn ?
          <Nav pullRight>
            <NavDropdown title={dropdownTitle} id="user-dropdown">
              <MenuItem
                href={createHref('/member/subscriptions/')}
                onClick={this.handleSelected}
              ><Icon icon="folder" /> Subscriptions
            </MenuItem>
              <MenuItem
                href={createHref('/member/bookmarks/')}
                onClick={this.handleSelected}
              ><Icon icon="bookmark" /> Bookmarks
              </MenuItem>
              <MenuItem
                href={createHref('/member/recent/')}
                onClick={this.handleSelected}
              ><Icon icon="history" /> Recent
              </MenuItem>
              <MenuItem
                href={createHref('/user/')}
                onClick={this.handleSelected}
              ><Icon icon="cog" /> Settings
              </MenuItem>
              <MenuItem href="#" onClick={this.props.onLogout}>
                <Icon icon="sign-out" /> Logout
              </MenuItem>
            </NavDropdown>
          </Nav> :
          <Nav pullRight>
            <NavItem
              active={isActive('/login/')}
              href={createHref('/login/')}
              onClick={this.handleSelected}
            ><Icon icon="sign-in" /> Login
            </NavItem>
            <NavItem
              active={isActive('/signup/')}
              href={createHref('/signup/')}
              onClick={this.handleSelected}
            ><Icon icon="sign-in" /> Signup
            </NavItem>
          </Nav>}
        </Navbar.Collapse>

      </Navbar>
    );
  }
}

NavBar.propTypes = {
  onOpenAddChannelForm: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
};

export default NavBar;

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
import { shallow } from 'enzyme';
import { Nav, NavItem, Navbar, NavDropdown, MenuItem } from 'react-bootstrap';
import NavBar from './navbar';
import Gravatar from './gravatar';
import Icon from './icon';

const mockRouter = {
  createHref: jest.fn(),
  isActive: jest.fn(),
};

const mockAuth = {
  isLoggedIn: false,
  name: '',
  email: '',
};

const mockProps = {
  onOpenAddChannelForm: jest.fn(),
  onLogout: jest.fn(),
  auth: mockAuth,
  router: mockRouter,
};

describe('NavBar', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<NavBar {...mockProps} />);
  });

  it('renders the navbar', () => {
    expect(wrapper.find(Navbar)).toHaveLength(1);
  });

  it('renders the brand link', () => {
    expect(wrapper.find(Navbar.Brand).find('Link').prop('to')).toBe('/');
  });

  it('renders the toggle button', () => {
    expect(wrapper.find(Navbar.Toggle)).toHaveLength(1);
  });

  describe('when logged out', () => {
    it('renders the login and signup links', () => {
      expect(wrapper.find(Nav).at(1).find(NavItem)).toHaveLength(2);
      expect(wrapper.find(Nav).at(1).find(NavItem).at(0).prop('href')).toBe('/login/');
      expect(wrapper.find(Nav).at(1).find(NavItem).at(1).prop('href')).toBe('/signup/');
    });

    it('does not render the add channel link', () => {
      expect(wrapper.find(Nav).at(0).find(NavItem)).toHaveLength(4);
    });

    it('does not render the user dropdown', () => {
      expect(wrapper.find(NavDropdown)).toHaveLength(0);
    });
  });

  describe('when logged in', () => {
    beforeEach(() => {
      mockAuth.isLoggedIn = true;
      mockAuth.name = 'John Doe';
      mockAuth.email = 'john.doe@example.com';
      wrapper = shallow(<NavBar {...mockProps} />);
    });

    it('renders the add channel link', () => {
      expect(wrapper.find(Nav).at(0).find(NavItem)).toHaveLength(5);
      expect(wrapper.find(Nav).at(0).find(NavItem).at(4).prop('onClick')).toBe(mockProps.onOpenAddChannelForm);
    });

    it('renders the user dropdown', () => {
      expect(wrapper.find(NavDropdown)).toHaveLength(1);
      expect(wrapper.find(NavDropdown).prop('title')).toEqual(<span><Gravatar email={mockAuth.email} /> {mockAuth.name}</span>);
    });

    it('renders the user dropdown items', () => {
      expect(wrapper.find(NavDropdown).find(MenuItem)).toHaveLength(5);
      expect(wrapper.find(NavDropdown).find(MenuItem).at(0).prop('href')).toBe('/member/subscriptions/');
      expect(wrapper.find(NavDropdown).find(MenuItem).at(1).prop('href')).toBe('/member/bookmarks/');
      expect(wrapper.find(NavDropdown).find(MenuItem).at(2).prop('href')).toBe('/member/recent/');
      expect(wrapper.find(NavDropdown).find(MenuItem).at(3).prop('href')).toBe('/user/');
      expect(wrapper.find(NavDropdown).find(MenuItem).at(4).prop('onClick')).toBe(mockProps.onLogout);
    });
  });

  it('handles toggle', () => {
    wrapper.instance().handleToggle();
    expect(wrapper.state('expanded')).toBe(true);
  });

  it('handles selected', () => {
    wrapper.setState({ expanded: true });
    wrapper.instance().handleSelected();
    expect(wrapper.state('expanded')).toBe(false);
  });

  it('handles open add channel form', () => {
    wrapper.instance().handleOpenAddChannelForm();
    expect(mockProps.onOpenAddChannelForm).toHaveBeenCalled();
    expect(wrapper.state('expanded')).toBe(false);
  });
});

```

### Tokens: {'input_tokens': 1223, 'output_tokens': 1013}
### Execution time: 29.887834072113037
