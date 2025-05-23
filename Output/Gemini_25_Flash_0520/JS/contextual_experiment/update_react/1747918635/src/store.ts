import { configureStore, Middleware } from '@reduxjs/toolkit';
import todoReducer, { loadTodos } from './features/todos/todoSlice';
import { store as localStorageStore } from './utils/helpers';
import { TODO_APP_KEY } from './constants';
import { ITodo } from './types';

const localStorageMiddleware: Middleware = ({ getState }) => (next) => (action) => {
  const result = next(action);
  localStorageStore(TODO_APP_KEY, (getState() as RootState).todos.todos);
  return result;
};

export const store = configureStore({
  reducer: {
    todos: todoReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

// Load initial state from local storage
const initialTodos: ITodo[] = localStorageStore(TODO_APP_KEY);
if (initialTodos.length > 0) {
  store.dispatch(loadTodos(initialTodos));
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
