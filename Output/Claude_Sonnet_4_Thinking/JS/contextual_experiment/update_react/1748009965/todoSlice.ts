import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { Todo } from './types';
import { store as localStore } from './utils';

interface TodoState {
  todos: Todo[];
  editingId: string | null;
}

const initialState: TodoState = {
  todos: localStore('react-todos') || [],
  editingId: null,
};

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
      state.todos.push(newTodo);
      localStore('react-todos', state.todos);
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        localStore('react-todos', state.todos);
      }
    },
    toggleAll: (state, action: PayloadAction<boolean>) => {
      state.todos.forEach(todo => {
        todo.completed = action.payload;
      });
      localStore('react-todos', state.todos);
    },
    destroyTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
      if (state.editingId === action.payload) {
        state.editingId = null;
      }
      localStore('react-todos', state.todos);
    },
    saveTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.todos.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
        state.editingId = null;
        localStore('react-todos', state.todos);
      }
    },
    editTodo: (state, action: PayloadAction<string>) => {
      state.editingId = action.payload;
    },
    cancelEdit: (state) => {
      state.editingId = null;
    },
    clearCompleted: (state) => {
      state.todos = state.todos.filter(todo => !todo.completed);
      localStore('react-todos', state.todos);
    },
  },
});

export const {
  addTodo,
  toggleTodo,
  toggleAll,
  destroyTodo,
  saveTodo,
  editTodo,
  cancelEdit,
  clearCompleted,
} = todoSlice.actions;

export default todoSlice.reducer;