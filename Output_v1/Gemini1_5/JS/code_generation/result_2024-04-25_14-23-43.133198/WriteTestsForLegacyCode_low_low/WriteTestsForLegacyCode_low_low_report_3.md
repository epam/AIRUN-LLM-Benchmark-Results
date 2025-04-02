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
## Run 3:
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

  it('renders a Navbar component', () => {
    expect(wrapper.find(Navbar)).toHaveLength(1);
  });

  it('renders the brand link', () => {
    const brandLink = wrapper.find(Navbar.Brand).find('Link');
    expect(brandLink).toHaveLength(1);
    expect(brandLink.prop('to')).toBe('/');
    expect(brandLink.text()).toBe('<Icon /> PodBaby');
  });

  it('renders NavItems for navigation', () => {
    const navItems = wrapper.find(Nav).first().find(NavItem);
    expect(navItems).toHaveLength(5);
    expect(navItems.at(0).text()).toBe('<Icon /> New episodes');
    expect(navItems.at(1).text()).toBe('<Icon /> Browse');
    expect(navItems.at(2).text()).toBe('<Icon /> Search');
    expect(navItems.at(3).text()).toBe('<Icon /> Recommended');
  });

  it('renders login/signup NavItems when not logged in', () => {
    const authNavItems = wrapper.find(Nav).last().find(NavItem);
    expect(authNavItems).toHaveLength(2);
    expect(authNavItems.at(0).text()).toBe('<Icon /> Login');
    expect(authNavItems.at(1).text()).toBe('<Icon /> Signup');
  });

  it('renders user dropdown when logged in', () => {
    wrapper.setProps({ auth: { isLoggedIn: true, name: 'Test User', email: 'test@example.com' } });
    const userDropdown = wrapper.find(NavDropdown);
    expect(userDropdown).toHaveLength(1);
    expect(userDropdown.prop('title')).toEqual(<span><Gravatar email="test@example.com" /> Test User</span>);
  });

  it('renders user dropdown menu items', () => {
    wrapper.setProps({ auth: { isLoggedIn: true } });
    const menuItems = wrapper.find(NavDropdown).find(MenuItem);
    expect(menuItems).toHaveLength(5);
    expect(menuItems.at(0).text()).toBe('<Icon /> Subscriptions');
    expect(menuItems.at(1).text()).toBe('<Icon /> Bookmarks');
    expect(menuItems.at(2).text()).toBe('<Icon /> Recent');
    expect(menuItems.at(3).text()).toBe('<Icon /> Settings');
    expect(menuItems.at(4).text()).toBe('<Icon /> Logout');
  });

  it('calls onLogout when logout MenuItem is clicked', () => {
    wrapper.setProps({ auth: { isLoggedIn: true } });
    const logoutMenuItem = wrapper.find(NavDropdown).find(MenuItem).last();
    logoutMenuItem.simulate('click');
    expect(mockProps.onLogout).toHaveBeenCalled();
  });

  it('calls handleSelected when a NavItem is clicked', () => {
    const navItem = wrapper.find(NavItem).first();
    navItem.simulate('click');
    expect(wrapper.state('expanded')).toBe(false);
  });

  it('calls handleOpenAddChannelForm when Add Channel NavItem is clicked', () => {
    wrapper.setProps({ auth: { isLoggedIn: true } });
    const addChannelNavItem = wrapper.find(Nav).at(1).find(NavItem);
    addChannelNavItem.simulate('click');
    expect(mockProps.onOpenAddChannelForm).toHaveBeenCalled();
    expect(wrapper.state('expanded')).toBe(false);
  });
});

```

### Tokens: {'input_tokens': 1223, 'output_tokens': 1005}
### Execution time: 27.98496103286743
