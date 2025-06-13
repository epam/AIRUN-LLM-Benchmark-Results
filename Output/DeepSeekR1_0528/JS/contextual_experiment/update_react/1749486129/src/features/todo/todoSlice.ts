import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

const initialState: Todo[] = [];

const todoSlice = createSlice({
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
          completed: false,
        },
      }),
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    toggleAll: (state, action: PayloadAction<boolean>) => {
      state.forEach(todo => {
        todo.completed = action.payload;
      });
    },
    saveTodo: (state, action: PayloadAction<{id: string, text: string}>) => {
      const todo = state.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.text;
      }
    },
    destroyTodo: (state, action: PayloadAction<string>) => {
      return state.filter(todo => todo.id !== action.payload);
    },
    clearCompleted: (state) => {
      return state.filter(todo => !todo.completed);
    },
  },
});

export const { 
  addTodo, 
  toggleTodo, 
  toggleAll, 
  saveTodo, 
  destroyTodo, 
  clearCompleted 
} = todoSlice.actions;

export const selectTodos = (state: RootState) => state.todos;

export default todoSlice.reducer;