import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

const initialState: Todo[] = JSON.parse(localStorage.getItem('todos') || '[]');

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo(state, action: PayloadAction<string>) {
      state.push({ id: nanoid(), title: action.payload, completed: false });
      localStorage.setItem('todos', JSON.stringify(state));
    },
    removeTodo(state, action: PayloadAction<string>) {
      const index = state.findIndex((todo) => todo.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
      }
      localStorage.setItem('todos', JSON.stringify(state));
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const todo = state.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
      localStorage.setItem('todos', JSON.stringify(state));
    },
    clearCompleted(state) {
      state = state.filter((todo) => !todo.completed);
      localStorage.setItem('todos', JSON.stringify(state));
      return state;
    },
  },
});

export const { addTodo, removeTodo, toggleTodo, clearCompleted } = todoSlice.actions;
export default todoSlice;