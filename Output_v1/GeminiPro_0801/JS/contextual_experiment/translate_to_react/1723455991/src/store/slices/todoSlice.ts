import { createSlice } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { Todo } from '../../types';

const initialState: Todo[] = [];

export const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action) => {
      const newTodo: Todo = {
        id: nanoid(),
        title: action.payload,
        completed: false,
      };
      state.push(newTodo);
    },
    toggleTodo: (state, action) => {
      const index = state.findIndex((todo) => todo.id === action.payload);
      if (index !== -1) {
        state[index].completed = !state[index].completed;
      }
    },
    removeTodo: (state, action) => {
      return state.filter((todo) => todo.id !== action.payload);
    },
    clearCompletedTodos: (state) => {
      return state.filter((todo) => !todo.completed);
    },
  },
});

export const { addTodo, toggleTodo, removeTodo, clearCompletedTodos } = todoSlice.actions;

export default todoSlice.reducer;
