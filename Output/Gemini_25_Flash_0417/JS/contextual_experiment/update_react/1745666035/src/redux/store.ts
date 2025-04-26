import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './todosSlice';
import { store } from '../utils';
import { Todo } from '../types';

const TODO_STORAGE_KEY = 'react-todos';

const storeInstance = configureStore({
  reducer: {
    todos: todosReducer,
  },
});

// Subscribe to store changes and save to localStorage
storeInstance.subscribe(() => {
  store<Todo[]>(TODO_STORAGE_KEY, storeInstance.getState().todos.todos);
});

export type RootState = ReturnType<typeof storeInstance.getState>;
export type AppDispatch = typeof storeInstance.dispatch;

export default storeInstance;
