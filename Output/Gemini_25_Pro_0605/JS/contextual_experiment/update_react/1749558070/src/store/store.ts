import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './todosSlice';

const localStorageMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action);
  if (action.type.startsWith('todos/')) {
    const todosState = store.getState().todos;
    try {
      localStorage.setItem('react-todos', JSON.stringify(todosState));
    } catch (error) {
      console.error("Failed to save todos to localStorage", error);
    }
  }
  return result;
};

export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
