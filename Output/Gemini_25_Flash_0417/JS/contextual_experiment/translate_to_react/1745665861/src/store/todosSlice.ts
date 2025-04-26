import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { Todo } from '../types';
import { getTodos, saveTodos } from '../utils/localStorage';

const initialState: Todo[] = getTodos();

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      const newTodo: Todo = {
        id: nanoid(),
        title: action.payload.trim(),
        completed: false,
      };
      if (newTodo.title) {
        state.push(newTodo);
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
    toggleComplete: (state, action: PayloadAction<string>) => {
      const todo = state.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        saveTodos(state);
      }
    },
    editTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title.trim();
        if (!todo.title) {
          const index = state.findIndex(t => t.id === todo.id);
          state.splice(index, 1);
        }
        saveTodos(state);
      }
    },
    clearCompleted: (state) => {
      const newState = state.filter(todo => !todo.completed);
      saveTodos(newState);
      return newState;
    },
    toggleAllComplete: (state, action: PayloadAction<boolean>) => {
      state.forEach(todo => {
        todo.completed = action.payload;
      });
      saveTodos(state);
    },
  },
});

export const { addTodo, removeTodo, toggleComplete, editTodo, clearCompleted, toggleAllComplete } = todosSlice.actions;
export default todosSlice.reducer;
