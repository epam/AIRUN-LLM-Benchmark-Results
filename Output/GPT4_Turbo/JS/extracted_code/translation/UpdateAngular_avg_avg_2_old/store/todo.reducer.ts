import { createReducer, on } from '@ngrx/store';
import { Todo } from '../models/todo.model';
import * as TodoActions from './todo.actions';

export const initialState: Todo[] = [];

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.addTodo, (state, { title }) => [...state, { id: Date.now().toString(), title, completed: false }]),
  on(TodoActions.toggleTodo, (state, { id }) => state.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
  on(TodoActions.deleteTodo, (state, { id }) => state.filter(todo => todo.id !== id)),
  on(TodoActions.clearCompleted, state => state.filter(todo => !todo.completed))
);