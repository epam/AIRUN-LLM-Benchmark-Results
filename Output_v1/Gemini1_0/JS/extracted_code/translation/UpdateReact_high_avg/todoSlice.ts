import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: (state, action) => {
      state.push(action.payload);
    },
    toggleAll: (state, action) => {
      state.forEach((todo) => (todo.completed = action.payload));
    },
    toggle: (state, action) => {
      const todo = state.find((t) => t.id === action.payload.id);
      if (todo) todo.completed = !todo.completed;
    },
    destroy: (state, action) => {
      const index = state.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) state.splice(index, 1);
    },
    save: (state, action) => {
      const todo = state.find((t) => t.id === action.payload.id);
      if (todo) todo.title = action.payload.title;
    },
    clearCompleted: (state) => {
      state = state.filter((todo) => !todo.completed);
    },
  },
});

export const { addTodo, toggleAll, toggle, destroy, save, clearCompleted } = todoSlice.actions;

export default todoSlice.reducer;