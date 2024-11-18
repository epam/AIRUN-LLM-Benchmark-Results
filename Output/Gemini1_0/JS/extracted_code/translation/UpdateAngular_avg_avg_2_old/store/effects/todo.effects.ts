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

  deleteTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.deleteTodo),
      switchMap(({ id }) =>
        this.todoService.deleteTodo(id).pipe(
          map(() => TodoActions.deleteTodoSuccess({ id })),
          catchError((error) => of(TodoActions.deleteTodoFailure({ error })))
        )
      )
    )
  );

  editTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.editTodo),
      switchMap(({ todo }) =>
        this.todoService.editTodo(todo).pipe(
          map(() => TodoActions.editTodoSuccess({ todo })),
          catchError((error) => of(TodoActions.editTodoFailure({ error })))
        )
      )
    )
  );

  toggleTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.toggleTodo),
      switchMap(({ id }) =>
        this.todoService.toggleTodo(id).pipe(
          map(() => TodoActions.toggleTodoSuccess({ id })),
          catchError((error) => of(TodoActions.toggleTodoFailure({ error })))
        )
      )
    )
  );

  markAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.markAll),
      switchMap(({ checked }) =>
        this.todoService.markAll(checked).pipe(
          map(() => TodoActions.markAllSuccess({ checked })),
          catchError((error) => of(TodoActions.markAllFailure({ error })))
        )
      )
    )
  );

  clearDoneTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.clearDoneTodos),
      switchMap(() =>
        this.todoService.clearDoneTodos().pipe(
          map(() => TodoActions.clearDoneTodosSuccess()),
          catchError((error) => of(TodoActions.clearDoneTodosFailure({ error })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private todoService: TodoService) {}
}