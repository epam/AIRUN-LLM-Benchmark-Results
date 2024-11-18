import { createSelector } from '@ngrx/store';
import { Todo } from '../models/todo.model';
import { AppState } from '../state/app.state';

export const selectTodos = createSelector(
  (state: AppState) => state.todos,
  (todos: Todo[]) => todos
);