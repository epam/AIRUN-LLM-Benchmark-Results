import { createSlice } from '@reduxjs/toolkit';
import { uuid } from './utils';

interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}

const initialState: ITodo[] = [];

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

export const {
  addTodo,
  toggleAll,
  toggle,
  destroy,
  save,
  clearCompleted,
} = todoSlice.actions;

export default todoSlice.reducer;