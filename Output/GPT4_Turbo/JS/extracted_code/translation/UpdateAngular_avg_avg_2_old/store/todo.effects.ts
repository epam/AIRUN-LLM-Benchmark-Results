import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as TodoActions from './todo.actions';

@Injectable()
export class TodoEffects {
  constructor(private actions$: Actions) {}
}
