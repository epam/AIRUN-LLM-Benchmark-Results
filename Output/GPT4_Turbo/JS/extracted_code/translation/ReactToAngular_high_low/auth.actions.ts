import { createAction, props } from '@ngrx/store';

export const signup = createAction('[Auth] Signup', props<{ name: string; email: string; password: string }>());
export const signupComplete = createAction('[Auth] Signup Complete', props<{ data: any }>());
export const signupError = createAction('[Auth] Signup Error', props<{ error: any }>());