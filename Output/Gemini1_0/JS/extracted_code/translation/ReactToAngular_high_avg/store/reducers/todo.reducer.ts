import { createReducer, on } from '@ngrx/store';
import { Todo } from '../models/todo.model';
import * as TodoActions from '../actions/todo.actions';

export const initialState: Todo[] = [];

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.addTodoSuccess, (state, { todo }) => [...state, todo]),
  on(TodoActions.toggleAllSuccess, (state, { todos }) => todos),
  on(TodoActions.toggleSuccess, (state, { todo }) => {
    return state.map((t) => (t.id === todo.id ? todo : t));
  }),
  on(TodoActions.destroySuccess, (state, { todo }) => state.filter((t) => t.id !== todo.id)),
  on(TodoActions.editSuccess, (state, { todo }) => {
    return state.map((t) => (t.id === todo.id ? todo : t));
  }),
  on(TodoActions.saveSuccess, (state, { todo }) => {
    return state.map((t) => (t.id === todo.id ? todo : t));
  }),
  on(TodoActions.clearCompletedSuccess, (state) => state.filter((todo) => !todo.completed))
);