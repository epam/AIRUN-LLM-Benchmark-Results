import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import moment from 'moment';

interface CalendarState {
  events: Array<any>;
  eventSources: Array<any>;
}

const initialState: CalendarState = {
  events: [],
  eventSources: [],
};

export const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<any>) => {
      const newEvent = { ...action.payload, id: nanoid() };
      state.events.push(newEvent);
    },
    removeEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(event => event.id !== action.payload);
    },
    updateEvent: (state, action: PayloadAction<any>) => {
      const { id, ...updates } = action.payload;
      const eventIndex = state.events.findIndex(event => event.id === id);
      if (eventIndex !== -1) {
        state.events[eventIndex] = { ...state.events[eventIndex], ...updates };
      }
    },
    setEventSources: (state, action: PayloadAction<Array<any>>) => {
      state.eventSources = action.payload;
    },
  },
});

export const { addEvent, removeEvent, updateEvent, setEventSources } = calendarSlice.actions;

export default calendarSlice.reducer;