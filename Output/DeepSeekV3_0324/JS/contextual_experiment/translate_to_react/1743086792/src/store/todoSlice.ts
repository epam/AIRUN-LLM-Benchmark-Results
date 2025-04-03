import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { getTodos, saveTodos } from '../utils/storage';

type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

const initialState: Todo[] = getTodos();

export const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      const newTodo = {
        id: nanoid(),
        title: action.payload,
        completed: false
      };
      state.push(newTodo);
      saveTodos(state);
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        saveTodos(state);
      }
    },
    editTodo: (state, action: PayloadAction<{id: string, title: string}>) => {
      const todo = state.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
        saveTodos(state);
      }
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      const index = state.findIndex(todo => todo.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
        saveTodos(state);
      }
    },
    clearCompleted: (state) => {
      const activeTodos = state.filter(todo => !todo.completed);
      saveTodos(activeTodos);
      return activeTodos;
    },
    toggleAll: (state, action: PayloadAction<boolean>) => {
      state.forEach(todo => todo.completed = action.payload);
      saveTodos(state);
    }
  }
});

export const { addTodo, toggleTodo, editTodo, removeTodo, clearCompleted, toggleAll } = todoSlice.actions;
export default todoSlice.reducer;