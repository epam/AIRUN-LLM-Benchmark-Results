import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todo, FilterStatus, createTodo } from '../types';
import { loadState, saveState } from '../services/localStorage';

interface TodosState {
  todos: Todo[];
  filter: FilterStatus;
}

const initialState: TodosState = {
  todos: loadState(),
  filter: 'all',
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      const title = action.payload.trim();
      if (title) {
        const newTodo = createTodo(title);
        state.todos.push(newTodo);
        saveState(state.todos);
      }
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        saveState(state.todos);
      }
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
      saveState(state.todos);
    },
    editTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.todos.find(todo => todo.id === action.payload.id);
      if (todo) {
        const trimmedTitle = action.payload.title.trim();
        if (trimmedTitle) {
          todo.title = trimmedTitle;
        } else {
          state.todos = state.todos.filter(t => t.id !== action.payload.id);
        }
        saveState(state.todos);
      }
    },
    clearCompleted: (state) => {
      state.todos = state.todos.filter(todo => !todo.completed);
      saveState(state.todos);
    },
    toggleAll: (state, action: PayloadAction<boolean>) => {
      state.todos.forEach(todo => {
        todo.completed = action.payload;
      });
      saveState(state.todos);
    },
    setFilter: (state, action: PayloadAction<FilterStatus>) => {
      state.filter = action.payload;
    },
  },
});

export const {
  addTodo,
  toggleTodo,
  removeTodo,
  editTodo,
  clearCompleted,
  toggleAll,
  setFilter,
} = todosSlice.actions;

export default todosSlice.reducer;
