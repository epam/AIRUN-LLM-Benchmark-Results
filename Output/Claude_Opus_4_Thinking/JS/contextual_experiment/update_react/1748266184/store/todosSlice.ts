import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { ITodo } from '../types';
import { loadTodos, saveTodos } from '../utils/storage';

interface TodosState {
  items: ITodo[];
  editingId: string | null;
}

const STORAGE_KEY = 'react-todos';

const initialState: TodosState = {
  items: loadTodos(STORAGE_KEY),
  editingId: null
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      const newTodo: ITodo = {
        id: nanoid(),
        title: action.payload,
        completed: false
      };
      state.items.push(newTodo);
      saveTodos(STORAGE_KEY, state.items);
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.items.find(item => item.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        saveTodos(STORAGE_KEY, state.items);
      }
    },
    toggleAll: (state, action: PayloadAction<boolean>) => {
      state.items.forEach(todo => {
        todo.completed = action.payload;
      });
      saveTodos(STORAGE_KEY, state.items);
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(todo => todo.id !== action.payload);
      saveTodos(STORAGE_KEY, state.items);
    },
    updateTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.items.find(item => item.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
        saveTodos(STORAGE_KEY, state.items);
      }
    },
    clearCompleted: (state) => {
      state.items = state.items.filter(todo => !todo.completed);
      saveTodos(STORAGE_KEY, state.items);
    },
    setEditingId: (state, action: PayloadAction<string | null>) => {
      state.editingId = action.payload;
    }
  }
});

export const {
  addTodo,
  toggleTodo,
  toggleAll,
  deleteTodo,
  updateTodo,
  clearCompleted,
  setEditingId
} = todosSlice.actions;

export default todosSlice.reducer;