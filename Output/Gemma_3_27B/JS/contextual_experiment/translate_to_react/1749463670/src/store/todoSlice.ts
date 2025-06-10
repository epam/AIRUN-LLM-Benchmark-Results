import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodoState {
  todos: Todo[];
  newTodo: string;
  editedTodo: string | null;
  statusFilter: string | null;
}

const initialState: TodoState = {
  todos: [],
  newTodo: '',
  editedTodo: null,
  statusFilter: null,
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.newTodo = action.payload;
      state.todos.push({
        id: nanoid(),
        title: action.payload,
        completed: false,
      });
      state.newTodo = '';
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    editTodo: (state, action: PayloadAction<string | null>) => {
      state.editedTodo = action.payload;
    },
    updateTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
        state.editedTodo = null;
      }
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      state.editedTodo = null;
    },
    clearCompletedTodos: (state) => {
      state.todos = state.todos.filter((todo) => !todo.completed);
    },
    toggleAllTodos: (state) => {
      const areAllCompleted = state.todos.every((todo) => todo.completed);
      state.todos.forEach((todo) => {
        todo.completed = !areAllCompleted;
      });
    },
    setStatusFilter: (state, action: PayloadAction<string | null>) => {
      state.statusFilter = action.payload;
    }
  },
});

export const {
  addTodo,
  toggleTodo,
  editTodo,
  updateTodo,
  removeTodo,
  clearCompletedTodos,
  toggleAllTodos,
  setStatusFilter
} = todoSlice.actions;

export default todoSlice;