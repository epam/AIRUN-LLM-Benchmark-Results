import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { TodoService } from './todos.service';
import * as TodosActions from './todos.actions';

@Injectable()
export class TodosEffects {
  addTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosActions.addTodo),
      switchMap(({ title }) =>
        this.todoService.addTodo(title).pipe(
          map((todo) => TodosActions.addTodoSuccess({ todo })),
          catchError((error) => of(TodosActions.addTodoFailure({ error })))
        )
      )
    )
  );

  deleteTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosActions.deleteTodo),
      switchMap(({ id }) =>
        this.todoService.deleteTodo(id).pipe(
          map(() => TodosActions.deleteTodoSuccess({ id })),
          catchError((error) => of(TodosActions.deleteTodoFailure({ error })))
        )
      )
    )
  );

  editTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosActions.editTodo),
      switchMap(({ todo }) =>
        this.todoService.editTodo(todo).pipe(
          map(() => TodosActions.editTodoSuccess({ todo })),
          catchError((error) => of(TodosActions.editTodoFailure({ error })))
        )
      )
    )
  );

  toggleTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosActions.toggleTodo),
      switchMap(({ id }) =>
        this.todoService.toggleTodo(id).pipe(
          map(() => TodosActions.toggleTodoSuccess({ id })),
          catchError((error) => of(TodosActions.toggleTodoFailure({ error })))
        )
      )
    )
  );

  markAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosActions.markAll),
      switchMap(({ checked }) =>
        this.todoService.markAll(checked).pipe(
          map(() => TodosActions.markAllSuccess({ checked })),
          catchError((error) => of(TodosActions.markAllFailure({ error })))
        )
      )
    )
  );

  clearDoneTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosActions.clearDoneTodos),
      switchMap(() =>
        this.todoService.clearDoneTodos().pipe(
          map(() => TodosActions.clearDoneTodosSuccess()),
          catchError((error) => of(TodosActions.clearDoneTodosFailure({ error })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private todoService: TodoService) {}
}