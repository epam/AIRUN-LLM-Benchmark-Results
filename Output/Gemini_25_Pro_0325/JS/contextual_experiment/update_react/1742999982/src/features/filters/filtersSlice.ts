import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StatusFilters } from './constants';

interface FiltersState {
  status: StatusFilters;
}

const initialState: FiltersState = {
  status: StatusFilters.All,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    statusFilterChanged(state, action: PayloadAction<StatusFilters>) {
      state.status = action.payload;
    },
  },
});

export const { statusFilterChanged } = filtersSlice.actions;

export default filtersSlice.reducer;
export { StatusFilters };

