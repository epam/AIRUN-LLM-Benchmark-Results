import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

export interface Event {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  url?: string;
}

export interface CalendarState {
  events: Event[];
  view: string;
}

const initialState: CalendarState = {
  events: [],
  view: "dayGridMonth",
};

export const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<Event[]>) => {
      state.events = [...state.events, ...action.payload];
    },
    removeEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter((event) => event.id !== action.payload);
    },
    changeView: (state, action: PayloadAction<string>) => {
      state.view = action.payload;
    },
  },
});

export const { addEvent, removeEvent, changeView } = calendarSlice.actions;

export default calendarSlice.reducer;