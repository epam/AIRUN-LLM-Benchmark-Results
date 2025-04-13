```typescript
import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './todoSlice';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('react-todos');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state.todo);
    localStorage.setItem('react-todos', serializedState);
  } catch (err) {
    // Ignore errors
  }
};

const preloadedState = loadState();

const store = configureStore({
  reducer: {
    todo: todoReducer,
  },
  preloadedState: preloadedState ? { todo: preloadedState } : undefined,
});

store.subscribe(() => saveState(store.getState()));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;```