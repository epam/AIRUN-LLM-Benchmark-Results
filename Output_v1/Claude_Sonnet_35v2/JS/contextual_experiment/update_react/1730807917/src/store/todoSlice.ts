import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from '@reduxjs/toolkit';
import { Todo } from '../types/types';
import { FILTER_MODES, LOCAL_STORAGE_KEY } from '../constants/constants';
import { storage } from '../utils/utils';

interface TodoState {
  items: Todo[];
  filter: typeof FILTER_MODES[keyof typeof FILTER_MODES];
}

const initialState: TodoState = {
  items: storage.get(LOCAL_STORAGE_KEY),
  filter: FILTER_MODES.ALL
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer: (state, action: PayloadAction<Todo>) => {
        state.items.push(action.payload);
        storage.set(LOCAL_STORAGE_KEY, state.items);
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
      const todo = state.items.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        storage.set(LOCAL_STORAGE_KEY, state.items);
      }
    },
    toggleAllTodos: (state, action: PayloadAction<boolean>) => {
      state.items.forEach(todo => todo.completed = action.payload);
      storage.set(LOCAL_STORAGE_KEY, state.items);
    },
    editTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.items.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
        storage.set(LOCAL_STORAGE_KEY, state.items);
      }
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(todo => todo.id !== action.payload);
      storage.set(LOCAL_STORAGE_KEY, state.items);
    },
    clearCompleted: (state) => {
      state.items = state.items.filter(todo => !todo.completed);
      storage.set(LOCAL_STORAGE_KEY, state.items);
    },
    setFilter: (state, action: PayloadAction<typeof FILTER_MODES[keyof typeof FILTER_MODES]>) => {
      state.filter = action.payload;
    }
  }
});

export const {
  addTodo,
  toggleTodo,
  toggleAllTodos,
  editTodo,
  removeTodo,
  clearCompleted,
  setFilter
} = todoSlice.actions;

export default todoSlice.reducer;