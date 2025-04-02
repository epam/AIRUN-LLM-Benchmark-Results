import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { TodoService } from '../../services/todo.service';
import * as TodoActions from '../actions/todo.actions';

@Injectable()
export class TodoEffects {
  addTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.addTodo),
      switchMap(({ title }) =>
        this.todoService.addTodo(title).pipe(
          map((todo) => TodoActions.addTodoSuccess({ todo })),
          catchError((error) => of(TodoActions.addTodoFailure({ error })))
        )
      )
    )
  );

  toggleAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.toggleAll),
      switchMap(({ checked }) =>
        this.todoService.toggleAll(checked).pipe(
          map((todos) => TodoActions.toggleAllSuccess({ todos })),
          catchError((error) => of(TodoActions.toggleAllFailure({ error })))
        )
      )
    )
  );

  toggle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.toggle),
      switchMap(({ todo }) =>
        this.todoService.toggle(todo).pipe(
          map((todo) => TodoActions.toggleSuccess({ todo })),
          catchError((error) => of(TodoActions.toggleFailure({ error })))
        )
      )
    )
  );

  destroy$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.destroy),
      switchMap(({ todo }) =>
        this.todoService.destroy(todo).pipe(
          map(() => TodoActions.destroySuccess({ todo })),
          catchError((error) => of(TodoActions.destroyFailure({ error })))
        )
      )
    )
  );

  edit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.edit),
      switchMap(({ todo }) =>
        this.todoService.edit(todo).pipe(
          map((todo) => TodoActions.editSuccess({ todo })),
          catchError((error) => of(TodoActions.editFailure({ error })))
        )
      )
    )
  );

  save$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.save),
      switchMap(({ todo, text }) =>
        this.todoService.save(todo, text).pipe(
          map((todo) => TodoActions.saveSuccess({ todo })),
          catchError((error) => of(TodoActions.saveFailure({ error })))
        )
      )
    )
  );

  clearCompleted$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.clearCompleted),
      switchMap(() =>
        this.todoService.clearCompleted().pipe(
          map(() => TodoActions.clearCompletedSuccess()),
          catchError((error) => of(TodoActions.clearCompletedFailure({ error })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private todoService: TodoService) {}
}