import { createReducer, on } from '@ngrx/store';
import { Todo } from './todos.model';
import * as TodosActions from './todos.actions';

export const initialState: Todo[] = [];

export const todosReducer = createReducer(
  initialState,
  on(TodosActions.addTodoSuccess, (state, { todo }) => [...state, todo]),
  on(TodosActions.deleteTodoSuccess, (state, { id }) => state.filter((todo) => todo.id !== id)),
  on(TodosActions.editTodoSuccess, (state, { todo }) => {
    const index = state.findIndex((t) => t.id === todo.id);
    return [...state.slice(0, index), todo, ...state.slice(index + 1)];
  }),
  on(TodosActions.toggleTodoSuccess, (state, { id }) => {
    const index = state.findIndex((t) => t.id === id);
    return [...state.slice(0, index), { ...state[index], completed: !state[index].completed }, ...state.slice(index + 1)];
  }),
  on(TodosActions.markAllSuccess, (state, { checked }) => state.map((todo) => ({ ...todo, completed: checked }))),
  on(TodosActions.clearDoneTodosSuccess, (state) => state.filter((todo) => !todo.completed))
);