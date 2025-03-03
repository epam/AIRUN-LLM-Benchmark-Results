import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

const initialState: Todo[] = JSON.parse(localStorage.getItem('todos-angularjs-requirejs') || '[]');

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.push({
        id: nanoid(),
        title: action.payload,
        completed: false
      });
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      return state.filter(todo => todo.id !== action.payload);
    },
    updateTodo: (state, action: PayloadAction<{id: string; updates: Partial<Todo>}>) => {
      const todo = state.find(t => t.id === action.payload.id);
      if (todo) Object.assign(todo, action.payload.updates);
    },
    markAll: (state, action: PayloadAction<boolean>) => {
      state.forEach(todo => todo.completed = action.payload);
    },
    clearCompleted: (state) => {
      return state.filter(todo => !todo.completed);
    }
  }
});

export const { addTodo, removeTodo, updateTodo, markAll, clearCompleted } = todoSlice.actions;
export default todoSlice.reducer;
