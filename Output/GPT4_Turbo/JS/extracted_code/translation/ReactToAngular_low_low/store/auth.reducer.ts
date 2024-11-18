import { createReducer, on } from '@ngrx/store';
import { logout } from './auth.actions';

export interface AuthState {
  isLoggedIn: boolean;
  name: string;
  email: string;
}

export const initialState: AuthState = {
  isLoggedIn: false,
  name: '',
  email: ''
};

export const authReducer = createReducer(
  initialState,
  on(logout, state => ({ ...state, isLoggedIn: false }))
);