import { configureStore } from '@reduxjs/toolkit';
import todosReducer from '../features/todos/todosSlice';
import { loadState, saveState } from '../utils/localStorage';
import { LOCAL_STORAGE_KEY } from '../constants';

const preloadedState = loadState<{ todos: ReturnType<typeof todosReducer> }>(LOCAL_STORAGE_KEY);

export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  saveState({ todos: store.getState().todos }, LOCAL_STORAGE_KEY);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;