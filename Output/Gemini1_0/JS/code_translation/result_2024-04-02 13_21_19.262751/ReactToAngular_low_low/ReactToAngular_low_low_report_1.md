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
**navbar.component.html**
```html
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">
      <i class="fas fa-headphones"></i> PodBaby
    </a>
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a
            class="nav-link"
            [routerLink]="['/new']"
            [routerLinkActive]="['active']"
          >
            <i class="fas fa-flash"></i> New episodes
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            [routerLink]="['/browse']"
            [routerLinkActive]="['active']"
          >
            <i class="fas fa-list"></i> Browse
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            [routerLink]="['/search']"
            [routerLinkActive]="['active']"
          >
            <i class="fas fa-search"></i> Search
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            [routerLink]="['/recommendations']"
            [routerLinkActive]="['active']"
          >
            <i class="fas fa-thumbs-up"></i> Recommended
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            (click)="openAddChannelForm()"
            *ngIf="isLoggedIn"
          >
            <i class="fas fa-rss"></i> Add new feed
          </a>
        </li>
      </ul>
      <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
        <li class="nav-item dropdown" *ngIf="isLoggedIn">
          <a
            class="nav-link dropdown-toggle"
            href="#"
            id="navbarDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              [src]="gravatarUrl"
              alt="Gravatar"
              class="rounded-circle"
              width="30"
              height="30"
            />
            {{ name }}
          </a>
          <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
            <li>
              <a class="dropdown-item" [routerLink]="['/member/subscriptions']">
                <i class="fas fa-folder"></i> Subscriptions
              </a>
            </li>
            <li>
              <a class="dropdown-item" [routerLink]="['/member/bookmarks']">
                <i class="fas fa-bookmark"></i> Bookmarks
              </a>
            </li>
            <li>
              <a class="dropdown-item" [routerLink]="['/member/recent']">
                <i class="fas fa-history"></i> Recent
              </a>
            </li>
            <li>
              <a class="dropdown-item" [routerLink]="['/user']">
                <i class="fas fa-cog"></i> Settings
              </a>
            </li>
            <li>
              <a class="dropdown-item" (click)="logout()">
                <i class="fas fa-sign-out"></i> Logout
              </a>
            </li>
          </ul>
        </li>
        <li class="nav-item" *ngIf="!isLoggedIn">
          <a
            class="nav-link"
            [routerLink]="['/login']"
            [routerLinkActive]="['active']"
          >
            <i class="fas fa-sign-in"></i> Login
          </a>
        </li>
        <li class="nav-item" *ngIf="!isLoggedIn">
          <a
            class="nav-link"
            [routerLink]="['/signup']"
            [routerLinkActive]="['active']"
          >
            <i class="fas fa-sign-in"></i> Signup
          </a>
        </li>
      </ul>
    </div>
  </div>
</nav>
```

**navbar.component.ts**
```typescript
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthState } from '../store/auth/auth.reducer';
import { logout } from '../store/auth/auth.actions';
import { openAddChannelForm } from '../store/channels/channels.actions';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  name$: Observable<string>;
  email$: Observable<string>;
  gravatarUrl$: Observable<string>;

  constructor(private store: Store<AuthState>, private router: Router) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.store.select((state) => state.auth.isLoggedIn);
    this.name$ = this.store.select((state) => state.auth.user?.name);
    this.email$ = this.store.select((state) => state.auth.user?.email);
    this.gravatarUrl$ = this.store.select((state) => state.auth.user?.gravatarUrl);
  }

  openAddChannelForm(): void {
    this.store.dispatch(openAddChannelForm());
  }

  logout(): void {
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
  }
}
```

**navbar.module.ts**
```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [NavbarComponent],
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  exports: [NavbarComponent],
})
export class NavbarModule {}
```
### Tokens: {'prompt_tokens': 1244, 'completion_tokens': 1622, 'total_tokens': 2866}
### Execution time: 10.135066032409668

