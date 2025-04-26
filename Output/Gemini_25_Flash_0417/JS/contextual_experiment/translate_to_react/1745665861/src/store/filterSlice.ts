import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TodoFilter } from '../types';

const initialState: TodoFilter = 'all';

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<TodoFilter>) => {
      return action.payload;
    },
  },
});

export const { setFilter } = filterSlice.actions;
export default filterSlice.reducer;
