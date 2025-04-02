import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

const selectTodosState = (state: RootState) => state.todos;

export const selectTodos = createSelector(
  [selectTodosState],
  (todosState) => todosState.todos
);

export const selectActiveTodos = createSelector(
  [selectTodos],
  (todos) => todos.filter(todo => !todo.completed)
);

export const selectCompletedTodos = createSelector(
  [selectTodos],
  (todos) => todos.filter(todo => todo.completed)
);

export const selectRemainingTodosCount = createSelector(
  [selectActiveTodos],
  (activeTodos) => activeTodos.length
);

export const selectCompletedTodosCount = createSelector(
  [selectCompletedTodos],
  (completedTodos) => completedTodos.length
);

export const selectIsAllTodosChecked = createSelector(
  [selectTodos],
  (todos) => todos.every(todo => todo.completed) && todos.length > 0
);
