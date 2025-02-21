import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterType, Todo, TodoState } from '../types';
import { loadTodos, saveTodos } from '../utils';
import { TODO_APP_STORAGE_KEY } from '../constants';
import { generateId } from '../utils';

const initialState: TodoState = {
  todos: loadTodos(TODO_APP_STORAGE_KEY),
  filter: 'all',
  editingTodoId: null,
};

export const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer: (state, action: PayloadAction<{ title: string }>) => {
        const newTodo: Todo = {
          id: generateId(),
          title: action.payload.title,
          completed: false,
        };
        state.todos.push(newTodo);
        saveTodos(TODO_APP_STORAGE_KEY, state.todos);
      },
      prepare: (title: string) => ({ payload: { title } }),
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        saveTodos(TODO_APP_STORAGE_KEY, state.todos);
      }
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
      saveTodos(TODO_APP_STORAGE_KEY, state.todos);
    },
    editTodo: (state, action: PayloadAction<{ id: string, text: string }>) => {
      const todo = state.todos.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.text;
        saveTodos(TODO_APP_STORAGE_KEY, state.todos);
      }
      state.editingTodoId = null;
    },
    clearCompletedTodos: (state) => {
      state.todos = state.todos.filter(todo => !todo.completed);
      saveTodos(TODO_APP_STORAGE_KEY, state.todos);
    },
    setFilter: (state, action: PayloadAction<FilterType>) => {
      state.filter = action.payload;
    },
    setEditingTodoId: (state, action: PayloadAction<string | null>) => {
      state.editingTodoId = action.payload;
    },
  },
});

export const {
  addTodo,
  toggleTodo,
  deleteTodo,
  editTodo,
  clearCompletedTodos,
  setFilter,
  setEditingTodoId,
} = todoSlice.actions;

export default todoSlice.reducer;