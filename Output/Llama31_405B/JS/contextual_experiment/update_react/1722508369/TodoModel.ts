import { createSlice } from '@reduxjs/toolkit';
import { uuid } from './utils';

const initialState = [];

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo(state, action) {
      state.push({ id: uuid(), title: action.payload, completed: false });
    },
    toggleAll(state, action) {
      state.forEach((todo) => {
        todo.completed = action.payload;
      });
    },
    toggle(state, action) {
      const todo = state.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    destroy(state, action) {
      return state.filter((todo) => todo.id !== action.payload);
    },
    save(state, action) {
      const todo = state.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
      }
    },
    clearCompleted(state) {
      return state.filter((todo) => !todo.completed);
    },
  },
});

export default todoSlice.reducer;
export const {
  addTodo,
  toggleAll,
  toggle,
  destroy,
  save,
  clearCompleted,
} = todoSlice.actions;