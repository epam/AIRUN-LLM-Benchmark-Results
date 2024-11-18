import { createSelector } from '@ngrx/store';
import { Todo } from './todos.model';
import { AppState } from './app.state';

export const selectTodos = (state: AppState) => state.todos;

export const selectStatusFilter = (state: AppState) => state.statusFilter;

export const selectFilteredTodos = createSelector(
  selectTodos,
  selectStatusFilter,
  (todos, statusFilter) => {
    switch (statusFilter) {
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }
);