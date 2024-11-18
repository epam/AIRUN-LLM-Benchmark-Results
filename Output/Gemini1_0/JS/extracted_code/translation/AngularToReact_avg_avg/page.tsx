import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Page {
  id: number;
  title: string;
  description: string;
  header: string;
  subheader: string;
  body: string;
  url: string;
  type: string;
  published: string;
  published_date: string;
  themePages: [];
  timestamp: string;
  extras: [];
  misc: {};
}

const initialState: Page = {
  id: 0,
  title: '',
  description: '',
  header: '',
  subheader: '',
  body: '',
  url: '',
  type: '',
  published: '',
  published_date: '',
  themePages: [],
  timestamp: '',
  extras: [],
  misc: {},
};

export const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<Page>) => {
      return action.payload;
    },
  },
});

export const { setPage } = pageSlice.actions;

export default pageSlice.reducer;