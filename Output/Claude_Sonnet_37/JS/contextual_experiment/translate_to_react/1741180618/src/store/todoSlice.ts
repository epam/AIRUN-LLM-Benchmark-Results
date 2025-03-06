import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodoState {
  todos: Todo[];
  status: 'all' | 'active' | 'completed';
  editingId: string | null;
}

const STORAGE_ID = 'todos-angularjs-requirejs';

const loadTodos = (): Todo[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
  } catch (e) {
    return [];
  }
};

const saveTodos = (todos: Todo[]) => {
  localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
};

const initialState: TodoState = {
  todos: loadTodos(),
  status: 'all',
  editingId: null,
};

export const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      const newTodo = {
        id: nanoid(),
        title: action.payload,
        completed: false,
      };
      state.todos.push(newTodo);
      saveTodos(state.todos);
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        saveTodos(state.todos);
      }
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
      saveTodos(state.todos);
    },
    editTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.todos.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
        saveTodos(state.todos);
      }
    },
    setEditingId: (state, action: PayloadAction<string | null>) => {
      state.editingId = action.payload;
    },
    clearCompleted: (state) => {
      state.todos = state.todos.filter(todo => !todo.completed);
      saveTodos(state.todos);
    },
    markAllAs: (state, action: PayloadAction<boolean>) => {
      state.todos.forEach(todo => {
        todo.completed = action.payload;
      });
      saveTodos(state.todos);
    },
    setStatus: (state, action: PayloadAction<'all' | 'active' | 'completed'>) => {
      state.status = action.payload;
    },
  },
});

export const {
  addTodo,
  toggleTodo,
  removeTodo,
  editTodo,
  setEditingId,
  clearCompleted,
  markAllAs,
  setStatus,
} = todoSlice.actions;

export default todoSlice.reducer;