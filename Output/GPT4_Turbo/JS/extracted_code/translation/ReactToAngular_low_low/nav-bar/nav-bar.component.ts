import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthState } from '../store/auth.reducer';
import { logout } from '../store/auth.actions';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  auth$: Observable<AuthState>;
  expanded: boolean = false;

  constructor(private store: Store<{ auth: AuthState }>) {
    this.auth$ = store.select('auth');
  }

  ngOnInit(): void {
  }

  handleToggle(): void {
    this.expanded = !this.expanded;
  }

  handleSelected(): void {
    this.expanded = false;
  }

  handleOpenAddChannelForm(event: Event): void {
    // Implement your method to open add channel form
    this.handleSelected();
  }

  onLogout(): void {
    this.store.dispatch(logout());
  }
}