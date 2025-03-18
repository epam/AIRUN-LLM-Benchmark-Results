import { createReducer, on } from '@ngrx/store';
import { Todo } from '../models/todo.model';
import * as TodoActions from '../actions/todo.actions';

export const initialState: Todo[] = [];

const _todoReducer = createReducer(
  initialState,
  on(TodoActions.addTodoSuccess, (state, { todo }) => [...state, todo]),
  on(TodoActions.deleteTodoSuccess, (state, { id }) => state.filter((todo) => todo.id !== id)),
  on(TodoActions.editTodoSuccess, (state, { todo }) => {
    const index = state.findIndex((t) => t.id === todo.id);
    return [...state.slice(0, index), todo, ...state.slice(index + 1)];
  }),
  on(TodoActions.toggleTodoSuccess, (state, { id }) => {
    const index = state.findIndex((t) => t.id === id);
    return [...state.slice(0, index), { ...state[index], completed: !state[index].completed }, ...state.slice(index + 1)];
  }),
  on(TodoActions.markAllSuccess, (state, { checked }) => state.map((todo) => ({ ...todo, completed: checked }))),
  on(TodoActions.clearDoneTodosSuccess, (state) => state.filter((todo) => !todo.completed))
);

export function todoReducer(state: Todo[] | undefined, action: any) {
  return _todoReducer(state, action);
}