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