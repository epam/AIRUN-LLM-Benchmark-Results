import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

interface PageState {
  id: string;
  title: string;
  description: string;
  url: string;
  publish: string;
  scheduleDate: Date | null;
  tags: string[];
  type: string;
  themePages: string[];
}

const initialState: PageState = {
  id: nanoid(),
  title: '',
  description: '',
  url: '',
  publish: '',
  scheduleDate: null,
  tags: [],
  type: '',
  themePages: [],
};

export const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setPageTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setPageDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    // Define other reducers here
  },
});

export const { setPageTitle, setPageDescription } = pageSlice.actions;

export default pageSlice.reducer;