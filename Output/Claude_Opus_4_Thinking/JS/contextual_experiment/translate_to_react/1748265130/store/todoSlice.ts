import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { Todo, FilterType } from '../types/todo';

const STORAGE_ID = 'todos-angularjs-requirejs';

interface TodoState {
  todos: Todo[];
  filter: FilterType;
}

const loadTodos = (): Todo[] => {
  try {
    const todos = localStorage.getItem(STORAGE_ID);
    return todos ? JSON.parse(todos) : [];
  } catch {
    return [];
  }
};

const saveTodos = (todos: Todo[]) => {
  localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
};

const initialState: TodoState = {
  todos: loadTodos(),
  filter: 'all',
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.todos.push({
        id: nanoid(),
        title: action.payload,
        completed: false,
      });
      saveTodos(state.todos);
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
      saveTodos(state.todos);
    },
    updateTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.todos.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
        saveTodos(state.todos);
      }
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        saveTodos(state.todos);
      }
    },
    toggleAll: (state, action: PayloadAction<boolean>) => {
      state.todos.forEach(todo => {
        todo.completed = action.payload;
      });
      saveTodos(state.todos);
    },
    clearCompleted: (state) => {
      state.todos = state.todos.filter(todo => !todo.completed);
      saveTodos(state.todos);
    },
    setFilter: (state, action: PayloadAction<FilterType>) => {
      state.filter = action.payload;
    },
  },
});

export const {
  addTodo,
  removeTodo,
  updateTodo,
  toggleTodo,
  toggleAll,
  clearCompleted,
  setFilter,
} = todoSlice.actions;

export default todoSlice.reducer;