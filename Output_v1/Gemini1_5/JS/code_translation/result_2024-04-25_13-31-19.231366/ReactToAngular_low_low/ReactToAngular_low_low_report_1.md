I have the following React app code:

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


Your task is to migrate this code to Angular 14.x.
When performing the translation, ensure to adhere to the instructions below:
- Use common libraries: @ngrx/store and @ngrx/effects.
- Split the code into separate components.
- Optimize the code where possible.
- The converted code should not contain any TODOs.
- Return the translated code as markdown code snippets.
- Simply return the codebase without additional comments or explanations on how to convert it.

## Run 1:
### Answer:
## Angular Components

### navbar.component.ts

```typescript
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AuthState, selectAuth } from './auth/store/auth.reducer';
import { logout } from './auth/store/auth.actions';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  auth$: Observable<AuthState>;
  isExpanded = false;

  constructor(private store: Store<{ auth: AuthState }>) {
    this.auth$ = store.select(selectAuth);
  }

  ngOnInit(): void {
  }

  toggleNavbar(): void {
    this.isExpanded = !this.isExpanded;
  }

  onLogout(): void {
    this.store.dispatch(logout());
  }
}

```

### navbar-item.component.ts

```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-navbar-item',
  templateUrl: './navbar-item.component.html',
  styleUrls: ['./navbar-item.component.css']
})
export class NavbarItemComponent {
  @Input() icon: string;
  @Input() routerLink: string;
  @Input() active: boolean;
}

```

### navbar-dropdown.component.ts

```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-navbar-dropdown',
  templateUrl: './navbar-dropdown.component.html',
  styleUrls: ['./navbar-dropdown.component.css']
})
export class NavbarDropdownComponent {
  @Input() title: string;
  @Input() items: { icon: string, routerLink: string, label: string }[];
}

```

### gravatar.component.ts

```typescript
import { Component, Input } from '@angular/core';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-gravatar',
  template: `<img src="https://www.gravatar.com/avatar/{{hash}}?s=20" alt="Gravatar">`
})
export class GravatarComponent {
  @Input() email: string;
  hash: string;

  ngOnChanges(): void {
    this.hash = Md5.hashStr(this.email.trim().toLowerCase());
  }
}

```

### icon.component.ts

```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  template: `<i class="fa fa-{{icon}}"></i>`
})
export class IconComponent {
  @Input() icon: string;
}

``` 


### Tokens: {'input_tokens': 1244, 'output_tokens': 665}
### Execution time: 22.732439756393433
