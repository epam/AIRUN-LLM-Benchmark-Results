import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

export interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}

export interface TodoState {
  todos: ITodo[];
}

const LOCAL_STORAGE_KEY = 'react-todos';

function loadTodos(): ITodo[] {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as ITodo[];
    } catch {
      return [];
    }
  }
  return [];
}

function saveTodos(todos: ITodo[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
}

const initialState: TodoState = {
  todos: loadTodos(),
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo(state, action: PayloadAction<string>) {
      state.todos.push({
        id: nanoid(),
        title: action.payload.trim(),
        completed: false,
      });
      saveTodos(state.todos);
    },
    toggleAll(state, action: PayloadAction<boolean>) {
      state.todos.forEach(todo => {
        todo.completed = action.payload;
      });
      saveTodos(state.todos);
    },
    toggle(state, action: PayloadAction<string>) {
      const todo = state.todos.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        saveTodos(state.todos);
      }
    },
    destroy(state, action: PayloadAction<string>) {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
      saveTodos(state.todos);
    },
    save(state, action: PayloadAction<{id: string; title: string}>) {
      const todo = state.todos.find(t => t.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title.trim();
        saveTodos(state.todos);
      }
    },
    clearCompleted(state) {
      state.todos = state.todos.filter(todo => !todo.completed);
      saveTodos(state.todos);
    },
  },
});

export const { addTodo, toggleAll, toggle, destroy, save, clearCompleted } = todoSlice.actions;
export const todoReducer = todoSlice.reducer;

import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    todos: todoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
