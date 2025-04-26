import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todo, TodoState } from '../types';
import { uuid, store } from '../utils';

const TODO_STORAGE_KEY = 'react-todos';

const initialState: TodoState = {
  todos: store<Todo[]>(TODO_STORAGE_KEY) || [],
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      const newTodo: Todo = {
        id: uuid(),
        title: action.payload.trim(),
        completed: false,
      };
      if (newTodo.title) {
        state.todos.push(newTodo);
      }
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    toggleAllTodos: (state, action: PayloadAction<boolean>) => {
      state.todos.forEach(todo => {
        todo.completed = action.payload;
      });
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    },
    editTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.todos.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title.trim();
        if (!todo.title) {
          // If title is empty after trim, remove the todo
          state.todos = state.todos.filter(t => t.id !== todo.id);
        }
      }
    },
    clearCompletedTodos: (state) => {
      state.todos = state.todos.filter(todo => !todo.completed);
    },
  },
});

export const { addTodo, toggleTodo, toggleAllTodos, removeTodo, editTodo, clearCompletedTodos } = todosSlice.actions;

export default todosSlice.reducer;
