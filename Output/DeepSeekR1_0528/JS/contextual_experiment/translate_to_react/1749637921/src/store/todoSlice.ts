import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { Todo } from '../types/todo';

const initialState: Todo[] = [];

export const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer: (state, action: PayloadAction<Todo>) => {
        state.push(action.payload);
      },
      prepare: (title: string) => ({
        payload: {
          id: nanoid(),
          title,
          completed: false
        }
      })
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.find(todo => todo.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
    editTodo: (state, action: PayloadAction<{id: string; title: string}>) => {
      const todo = state.find(todo => todo.id === action.payload.id);
      if (todo) todo.title = action.payload.title;
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      return state.filter(todo => todo.id !== action.payload);
    },
    toggleAll: (state, action: PayloadAction<boolean>) => {
      state.forEach(todo => {
        todo.completed = action.payload;
      });
    },
    clearCompleted: (state) => {
      return state.filter(todo => !todo.completed);
    }
  }
});

export const { 
  addTodo, 
  toggleTodo, 
  editTodo, 
  removeTodo, 
  toggleAll, 
  clearCompleted 
} = todoSlice.actions;

export default todoSlice.reducer;
