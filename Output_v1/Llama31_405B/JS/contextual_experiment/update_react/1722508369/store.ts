import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './TodoModel';

export const store = configureStore({
  reducer: {
    todos: todoReducer,
  },
});