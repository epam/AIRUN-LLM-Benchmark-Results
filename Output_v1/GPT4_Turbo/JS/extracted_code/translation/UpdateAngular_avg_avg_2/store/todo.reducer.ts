import { createReducer, on } from '@ngrx/store';
import { Todo } from '../models/todo.model';
import * as TodoActions from './todo.actions';
import { v4 as uuidv4 } from 'uuid';

export const initialState: Todo[] = [];

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.addTodo, (state, { title }) => [...state, { id: uuidv4(), title, completed: false }]),
  on(TodoActions.toggleTodo, (state, { id }) => state.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
  on(TodoActions.deleteTodo, (state, { id }) => state.filter(todo => todo.id !== id))
);