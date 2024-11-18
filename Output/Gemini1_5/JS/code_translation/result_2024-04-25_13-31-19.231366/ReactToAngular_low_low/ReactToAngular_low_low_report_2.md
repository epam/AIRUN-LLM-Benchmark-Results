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

## Run 2:
### Answer:
## navbar.component.ts

```typescript
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AuthState } from '../../store/auth/auth.reducer';
import { selectAuth } from '../../store/auth/auth.selectors';
import { logout } from '../../store/auth/auth.actions';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  auth$: Observable<AuthState>;
  expanded = false;

  constructor(private store: Store) {}

  ngOnInit() {
    this.auth$ = this.store.select(selectAuth);
  }

  toggleNavbar() {
    this.expanded = !this.expanded;
  }

  onLogout() {
    this.store.dispatch(logout());
  }
}

```

## navbar.component.html

```html
<nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
  <a class="navbar-brand" routerLink="/">
    <i class="fas fa-headphones"></i> PodBaby
  </a>
  <button class="navbar-toggler" type="button" (click)="toggleNavbar()">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" [class.show]="expanded">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item" routerLinkActive="active">
        <a class="nav-link" routerLink="/new">
          <i class="fas fa-bolt"></i> New episodes
        </a>
      </li>
      <li class="nav-item" routerLinkActive="active">
        <a class="nav-link" routerLink="/browse">
          <i class="fas fa-list"></i> Browse
        </a>
      </li>
      <li class="nav-item" routerLinkActive="active">
        <a class="nav-link" routerLink="/search">
          <i class="fas fa-search"></i> Search
        </a>
      </li>
      <li class="nav-item" routerLinkActive="active">
        <a class="nav-link" routerLink="/recommendations">
          <i class="fas fa-thumbs-up"></i> Recommended
        </a>
      </li>
    </ul>

    <ng-container *ngIf="(auth$ | async) as auth">
      <ul class="navbar-nav mr-auto" *ngIf="auth.isLoggedIn">
        <li class="nav-item">
          <a class="nav-link" href="#">
            <i class="fas fa-rss"></i> Add new feed
          </a>
        </li>
      </ul>

      <ul class="navbar-nav ml-auto">
        <li class="nav-item dropdown" *ngIf="auth.isLoggedIn">
          <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <app-gravatar [email]="auth.email"></app-gravatar> {{ auth.name }}
          </a>
          <div class="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
            <a class="dropdown-item" routerLink="/member/subscriptions">
              <i class="fas fa-folder"></i> Subscriptions
            </a>
            <a class="dropdown-item" routerLink="/member/bookmarks">
              <i class="fas fa-bookmark"></i> Bookmarks
            </a>
            <a class="dropdown-item" routerLink="/member/recent">
              <i class="fas fa-history"></i> Recent
            </a>
            <a class="dropdown-item" routerLink="/user">
              <i class="fas fa-cog"></i> Settings
            </a>
            <a class="dropdown-item" href="#" (click)="onLogout()">
              <i class="fas fa-sign-out-alt"></i> Logout
            </a>
          </div>
        </li>
        <li class="nav-item" routerLinkActive="active" *ngIf="!auth.isLoggedIn">
          <a class="nav-link" routerLink="/login">
            <i class="fas fa-sign-in-alt"></i> Login
          </a>
        </li>
        <li class="nav-item" routerLinkActive="active" *ngIf="!auth.isLoggedIn">
          <a class="nav-link" routerLink="/signup">
            <i class="fas fa-sign-in-alt"></i> Signup
          </a>
        </li>
      </ul>
    </ng-container>
  </div>
</nav>

``` 


### Tokens: {'input_tokens': 1244, 'output_tokens': 1148}
### Execution time: 34.429296016693115
