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
## Run 2:
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
    expect(wrapper.find(Navbar.Brand).find('Link').prop('to')).toBe('/');
  });

  it('renders NavItems for new episodes, browse, search, and recommendations', () => {
    const navItems = wrapper.find(Nav).first().find(NavItem);
    expect(navItems).toHaveLength(4);
    expect(navItems.at(0).prop('href')).toBe('/new/');
    expect(navItems.at(1).prop('href')).toBe('/browse/');
    expect(navItems.at(2).prop('href')).toBe('/search/');
    expect(navItems.at(3).prop('href')).toBe('/recommendations/');
  });

  it('does not render the "Add new feed" NavItem when not logged in', () => {
    expect(wrapper.find(Nav).at(1).find(NavItem)).toHaveLength(0);
  });

  it('renders the "Add new feed" NavItem when logged in', () => {
    wrapper.setProps({ auth: { isLoggedIn: true } });
    expect(wrapper.find(Nav).at(1).find(NavItem)).toHaveLength(1);
  });

  it('does not render the user dropdown when not logged in', () => {
    expect(wrapper.find(NavDropdown)).toHaveLength(0);
  });

  it('renders the user dropdown when logged in', () => {
    wrapper.setProps({ auth: { isLoggedIn: true, name: 'Test User', email: 'test@example.com' } });
    const dropdown = wrapper.find(NavDropdown);
    expect(dropdown).toHaveLength(1);
    expect(dropdown.prop('title')).toEqual(<span><Gravatar email="test@example.com" /> Test User</span>);
  });

  it('renders user dropdown menu items', () => {
    wrapper.setProps({ auth: { isLoggedIn: true } });
    const dropdownItems = wrapper.find(NavDropdown).find(MenuItem);
    expect(dropdownItems).toHaveLength(5);
    expect(dropdownItems.at(0).prop('href')).toBe('/member/subscriptions/');
    expect(dropdownItems.at(1).prop('href')).toBe('/member/bookmarks/');
    expect(dropdownItems.at(2).prop('href')).toBe('/member/recent/');
    expect(dropdownItems.at(3).prop('href')).toBe('/user/');
    expect(dropdownItems.at(4).text()).toBe('Logout');
  });

  it('renders login and signup NavItems when not logged in', () => {
    const navItems = wrapper.find(Nav).last().find(NavItem);
    expect(navItems).toHaveLength(2);
    expect(navItems.at(0).prop('href')).toBe('/login/');
    expect(navItems.at(1).prop('href')).toBe('/signup/');
  });

  it('does not render login and signup NavItems when logged in', () => {
    wrapper.setProps({ auth: { isLoggedIn: true } });
    expect(wrapper.find(Nav).last().find(NavItem)).toHaveLength(0);
  });

  it('calls onOpenAddChannelForm when "Add new feed" NavItem is clicked', () => {
    wrapper.setProps({ auth: { isLoggedIn: true } });
    wrapper.find(Nav).at(1).find(NavItem).simulate('click');
    expect(mockProps.onOpenAddChannelForm).toHaveBeenCalled();
  });

  it('calls onLogout when logout MenuItem is clicked', () => {
    wrapper.setProps({ auth: { isLoggedIn: true } });
    wrapper.find(NavDropdown).find(MenuItem).last().simulate('click');
    expect(mockProps.onLogout).toHaveBeenCalled();
  });

  it('sets expanded state to true when navbar is toggled', () => {
    wrapper.find(Navbar).simulate('toggle');
    expect(wrapper.state('expanded')).toBe(true);
  });

  it('sets expanded state to false when a NavItem is clicked', () => {
    wrapper.setState({ expanded: true });
    wrapper.find(NavItem).first().simulate('click');
    expect(wrapper.state('expanded')).toBe(false);
  });
});

```

### Tokens: {'input_tokens': 1223, 'output_tokens': 1199}
### Execution time: 35.55942511558533
