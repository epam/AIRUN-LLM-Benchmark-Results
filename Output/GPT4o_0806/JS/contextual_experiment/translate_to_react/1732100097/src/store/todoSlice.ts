import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { Todo } from '../types/todo';

const initialState: Todo[] = JSON.parse(localStorage.getItem('todos-react') || '[]');

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      const newTodo: Todo = {
        id: nanoid(),
        title: action.payload,
        completed: false,
      };
      state.push(newTodo);
      localStorage.setItem('todos-react', JSON.stringify(state));
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        localStorage.setItem('todos-react', JSON.stringify(state));
      }
    },
    editTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
        localStorage.setItem('todos-react', JSON.stringify(state));
      }
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      const index = state.findIndex(todo => todo.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
        localStorage.setItem('todos-react', JSON.stringify(state));
      }
    },
    clearCompleted: (state) => {
      const activeTodos = state.filter(todo => !todo.completed);
      localStorage.setItem('todos-react', JSON.stringify(activeTodos));
      return activeTodos;
    },
    markAll: (state, action: PayloadAction<boolean>) => {
      state.forEach(todo => {
        todo.completed = action.payload;
      });
      localStorage.setItem('todos-react', JSON.stringify(state));
    },
  },
});

export const { addTodo, toggleTodo, editTodo, removeTodo, clearCompleted, markAll } = todoSlice.actions;

export default todoSlice.reducer;