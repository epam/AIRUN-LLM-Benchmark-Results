import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './todosSlice';

export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { useSelector, useDispatch } from 'react-redux';
export const useAppSelector = useSelector<RootState>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
