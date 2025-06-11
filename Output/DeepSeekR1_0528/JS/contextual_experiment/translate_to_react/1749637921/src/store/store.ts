import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './todoSlice';
import { loadTodos } from '../hooks/useLocalStorage';

export const store = configureStore({
  reducer: {
    todos: todoReducer
  },
  preloadedState: {
    todos: loadTodos('todos')
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
