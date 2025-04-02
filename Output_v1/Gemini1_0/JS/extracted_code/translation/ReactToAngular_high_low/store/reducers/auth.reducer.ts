import { createReducer, on } from '@ngrx/store';
import { AuthActions } from '../actions';

export interface AuthState {
  user: User | null;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  error: null
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.signupSuccess, (state, { user }) => ({ ...state, user })),
  on(AuthActions.signupFailure, (state, { error }) => ({ ...state, error }))
);