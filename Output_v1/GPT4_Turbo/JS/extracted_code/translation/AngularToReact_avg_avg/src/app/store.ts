import { configureStore } from '@reduxjs/toolkit';
import menuReducer from '../features/menu/menuSlice';

export const store = configureStore({
  reducer: {
    menu: menuReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;