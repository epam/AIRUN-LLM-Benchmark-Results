import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { Todo } from '../models/Todo';

interface TodoState {
  todos: Todo[];
  editedTodo: Todo | null;
  filter: 'all' | 'active' | 'completed';
}

const initialState: TodoState = {
  todos: JSON.parse(localStorage.getItem('todos') || '[]'),
  editedTodo: null,
  filter: 'all',
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer: (state, action: PayloadAction<Todo>) => {
        state.todos.push(action.payload);
        localStorage.setItem('todos', JSON.stringify(state.todos));
      },
      prepare: (title: string) => {
        return { payload: { id: nanoid(), title, completed: false } };
      },
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        localStorage.setItem('todos', JSON.stringify(state.todos));
      }
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      localStorage.setItem('todos', JSON.stringify(state.todos));
    },
    editTodo: (state, action: PayloadAction<Todo>) => {
      state.editedTodo = action.payload;
    },
    doneEditing: (state, action: PayloadAction<Todo>) => {
      const index = state.todos.findIndex((todo) => todo.id === action.payload.id);
      if (index !== -1) {
        state.todos[index] = action.payload;
        localStorage.setItem('todos', JSON.stringify(state.todos));
      }
      state.editedTodo = null;
    },
    revertEditing: (state) => {
      if (state.editedTodo) {
        const index = state.todos.findIndex((todo) => todo.id === state.editedTodo?.id);
        if (index !== -1) {
          state.todos[index] = state.editedTodo;
        }
        state.editedTodo = null;
      }
    },
    clearDoneTodos: (state) => {
      state.todos = state.todos.filter((todo) => !todo.completed);
      localStorage.setItem('todos', JSON.stringify(state.todos));
    },
    markAll: (state, action: PayloadAction<boolean>) => {
      state.todos.forEach((todo) => {
        todo.completed = action.payload;
      });
      localStorage.setItem('todos', JSON.stringify(state.todos));
    },
    setFilter: (state, action: PayloadAction<'all' | 'active' | 'completed'>) => {
      state.filter = action.payload;
    },
  },
});

export const {
  addTodo,
  toggleTodo,
  removeTodo,
  editTodo,
  doneEditing,
  revertEditing,
  clearDoneTodos,
  markAll,
  setFilter,
} = todoSlice.actions;

export default todoSlice.reducer;