import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { TodosService } from '../todos.service';
import { addTodo } from './todos.actions';

@Injectable()
export class TodosEffects {

  addTodo$ = createEffect(() => this.actions$.pipe(
    ofType(addTodo),
    mergeMap((action) => this.todosService.addTodo(action.title)
      .pipe(
        map(todo => ({ type: '[Todo] Add Todo Success', payload: todo })),
        catchError(() => EMPTY)
      ))
    )
  );

  constructor(
    private actions$: Actions,
    private todosService: TodosService
  ) {}
}