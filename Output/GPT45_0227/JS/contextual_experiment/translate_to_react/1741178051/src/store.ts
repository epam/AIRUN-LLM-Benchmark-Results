import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import todosReducer from './features/todos/todosSlice';

const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
});

store.subscribe(() => {
  localStorage.setItem('todos-react-redux', JSON.stringify(store.getState().todos.todos));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;