import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/rootReducer';

interface FilterState {
  status: 'all' | 'active' | 'completed';
}

const initialState: FilterState = {
  status: 'all',
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<'all' | 'active' | 'completed'>) => {
      state.status = action.payload;
    },
  },
});

export const { setFilter } = filterSlice.actions;

export const selectFilter = (state: RootState) => state.filter.status;

export default filterSlice.reducer;