import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

interface MenuItem {
  id: string;
  title: string;
  url: string;
  items: MenuItem[];
}

interface MenuState {
  menus: MenuItem[];
  selectedMenuId: string | null;
}

const initialState: MenuState = {
  menus: [],
  selectedMenuId: null,
};

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    addMenu: (state, action: PayloadAction<{ title: string }>) => {
      state.menus.push({
        id: nanoid(),
        title: action.payload.title,
        url: '',
        items: [],
      });
    },
    selectMenu: (state, action: PayloadAction<{ menuId: string }>) => {
      state.selectedMenuId = action.payload.menuId;
    },
    // Additional reducers as needed
  },
});

export const { addMenu, selectMenu } = menuSlice.actions;

export default menuSlice.reducer;