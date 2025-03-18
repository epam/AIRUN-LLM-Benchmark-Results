import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { Todo, TodoState } from '../types';

const STORAGE_ID = 'todos-react';

// Helper functions for localStorage
const loadTodos = (): Todo[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
  } catch (e) {
    return [];
  }
};

const saveTodos = (todos: Todo[]): void => {
  localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
};

const initialState: TodoState = {
  todos: loadTodos(),
  status: 'all',
  editedTodoId: null,
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      const title = action.payload.trim();
      if (title) {
        state.todos.push({
          id: nanoid(),
          title,
          completed: false,
        });
        saveTodos(state.todos);
      }
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        saveTodos(state.todos);
      }
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
      saveTodos(state.todos);
    },
    updateTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const { id, title } = action.payload;
      const trimmedTitle = title.trim();
      
      if (!trimmedTitle) {
        state.todos = state.todos.filter(todo => todo.id !== id);
      } else {
        const todo = state.todos.find(todo => todo.id === id);
        if (todo) {
          todo.title = trimmedTitle;
        }
      }
      
      state.editedTodoId = null;
      saveTodos(state.todos);
    },
    setEditedTodoId: (state, action: PayloadAction<string | null>) => {
      state.editedTodoId = action.payload;
    },
    clearCompleted: (state) => {
      state.todos = state.todos.filter(todo => !todo.completed);
      saveTodos(state.todos);
    },
    markAll: (state, action: PayloadAction<boolean>) => {
      state.todos.forEach(todo => {
        todo.completed = action.payload;
      });
      saveTodos(state.todos);
    },
    setFilter: (state, action: PayloadAction<'all' | 'active' | 'completed'>) => {
      state.status = action.payload;
    },
  },
});

export const {
  addTodo,
  toggleTodo,
  removeTodo,
  updateTodo,
  setEditedTodoId,
  clearCompleted,
  markAll,
  setFilter,
} = todosSlice.actions;

export default todosSlice.reducer;
