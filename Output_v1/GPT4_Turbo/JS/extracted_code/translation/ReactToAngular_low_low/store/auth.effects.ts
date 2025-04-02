import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, exhaustMap } from 'rxjs/operators';
import { logout } from './auth.actions';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions) {}

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      exhaustMap(() =>
        // Implement your logout logic here, for example, a service call
        of(true).pipe(
          map(() => ({ type: '[Auth] Logout Success' })),
          catchError(() => of({ type: '[Auth] Logout Failure' }))
        )
      )
    )
  );
}