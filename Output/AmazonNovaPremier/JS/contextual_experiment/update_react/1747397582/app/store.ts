import { configureStore } from '@reduxjs/toolkit';
import todoReducer from '../features/todos/todoSlice';
import filterReducer from '../features/filter/filterSlice';
import { saveState, loadState } from '../utils/localStorage';

const preloadedState = loadState('appState');

export const store = configureStore({
  reducer: {
    todos: todoReducer,
    filter: filterReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  saveState('appState', store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;