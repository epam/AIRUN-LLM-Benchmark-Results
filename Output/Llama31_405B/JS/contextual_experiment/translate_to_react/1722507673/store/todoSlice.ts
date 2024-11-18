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
      return state.filter((todo) => todo.id !== action.payload);
    },
    toggleTodo(state, action: PayloadAction<string>) {
      return state.map((todo) =>
        todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
      );
    },
    clearCompleted(state) {
      return state.filter((todo) => !todo.completed);
    },
  },
});

export const { addTodo, removeTodo, toggleTodo, clearCompleted } = todoSlice.actions;
export default todoSlice;