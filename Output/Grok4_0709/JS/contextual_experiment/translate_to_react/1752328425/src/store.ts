import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './features/todos/todoSlice';

export const store = configureStore({
  reducer: {
    todos: todoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;