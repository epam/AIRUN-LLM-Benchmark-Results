import { configureStore } from '@reduxjs/toolkit';
import { restApi } from './rest';
import pageReducer from './page';
import menuReducer from './menu';

export const store = configureStore({
  reducer: {
    [restApi.reducerPath]: restApi.reducer,
    page: pageReducer,
    menu: menuReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(restApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;