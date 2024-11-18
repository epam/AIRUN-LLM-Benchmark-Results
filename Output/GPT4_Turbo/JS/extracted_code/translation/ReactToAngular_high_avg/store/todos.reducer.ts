import { createReducer, on } from '@ngrx/store';
import { addTodo, toggleTodo, destroyTodo, editTodo, toggleAll, clearCompleted } from './todos.actions';
import { Todo } from '../todo.model';

export const initialState: Todo[] = [];

export const todosReducer = createReducer(
  initialState,
  on(addTodo, (state, { title }) => [...state, { id: Date.now().toString(), title, completed: false }]),
  on(toggleTodo, (state, { id }) => state.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
  on(destroyTodo, (state, { id }) => state.filter(todo => todo.id !== id)),
  on(editTodo, (state, { id, title }) => state.map(todo => todo.id === id ? { ...todo, title } : todo)),
  on(toggleAll, (state, { completed }) => state.map(todo => ({ ...todo, completed }))),
  on(clearCompleted, state => state.filter(todo => !todo.completed))
);