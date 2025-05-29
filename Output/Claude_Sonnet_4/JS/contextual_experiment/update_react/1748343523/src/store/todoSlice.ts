import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { Todo, TodoState } from '../types';
import { store } from '../utils';
import { ALL_TODOS } from '../constants';

const STORAGE_KEY = 'react-todos';

const initialState: TodoState = {
  todos: store(STORAGE_KEY),
  filter: ALL_TODOS,
  editingId: null
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      const newTodo: Todo = {
        id: nanoid(),
        title: action.payload,
        completed: false
      };
      state.todos.push(newTodo);
      store(STORAGE_KEY, state.todos);
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        store(STORAGE_KEY, state.todos);
      }
    },
    destroyTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
      if (state.editingId === action.payload) {
        state.editingId = null;
      }
      store(STORAGE_KEY, state.todos);
    },
    editTodo: (state, action: PayloadAction<string>) => {
      state.editingId = action.payload;
    },
    saveTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.todos.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
        state.editingId = null;
        store(STORAGE_KEY, state.todos);
      }
    },
    cancelEdit: (state) => {
      state.editingId = null;
    },
    toggleAll: (state, action: PayloadAction<boolean>) => {
      state.todos.forEach(todo => {
        todo.completed = action.payload;
      });
      store(STORAGE_KEY, state.todos);
    },
    clearCompleted: (state) => {
      state.todos = state.todos.filter(todo => !todo.completed);
      store(STORAGE_KEY, state.todos);
    },
    setFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload;
    }
  }
});

export const {
  addTodo,
  toggleTodo,
  destroyTodo,
  editTodo,
  saveTodo,
  cancelEdit,
  toggleAll,
  clearCompleted,
  setFilter
} = todoSlice.actions;

export default todoSlice.reducer;