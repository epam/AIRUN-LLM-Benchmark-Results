import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Menu {
  id: number;
  name: string;
  area: string;
  menu: string;
}

const initialState: Menu = {
  id: 0,
  name: '',
  area: '',
  menu: '',
};

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMenu: (state, action: PayloadAction<Menu>) => {
      return action.payload;
    },
  },
});

export const { setMenu } = menuSlice.actions;

export default menuSlice.reducer;