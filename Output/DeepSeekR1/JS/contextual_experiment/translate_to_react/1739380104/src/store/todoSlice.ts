import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { Todo, FilterType, RootState } from '../types';
import { todoStorage } from '../services/todoStorage';
import { nanoid } from 'nanoid';

export const fetchTodos = createAsyncThunk('todos/fetch', async () => {
  return await todoStorage.get();
});

export const saveTodo = createAsyncThunk('todos/save', async (todo: Partial<Todo>) => {
  const newTodo = {
    ...todo,
    id: todo.id || nanoid(),
    createdAt: todo.createdAt || Date.now(),
    completed: todo.completed || false
  } as Todo;
  return await todoStorage.put(newTodo);
});

export const deleteTodo = createAsyncThunk('todos/delete', async (id: string) => {
  const todo = (await todoStorage.get()).find(t => t.id === id);
  if (todo) await todoStorage.delete(todo);
  return id;
});

const initialState: RootState = {
  todos: [],
  filter: 'all',
  editingId: null
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<FilterType>) {
      state.filter = action.payload;
    },
    markAllCompleted(state) {
      const allCompleted = state.todos.every(todo => todo.completed);
      state.todos = state.todos.map(todo => ({
        ...todo,
        completed: !allCompleted
      }));
    },
    clearCompleted(state) {
      state.todos = state.todos.filter(todo => !todo.completed);
    },
    startEditing(state, action: PayloadAction<string>) {
      state.editingId = action.payload;
    },
    endEditing(state) {
      state.editingId = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.todos = action.payload;
      })
      .addCase(saveTodo.fulfilled, (state, action) => {
        const index = state.todos.findIndex(t => t.id === action.payload.id);
        if (index >= 0) {
          state.todos[index] = action.payload;
        } else {
          state.todos.push(action.payload);
        }
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter(t => t.id !== action.payload);
      });
  }
});

export const { setFilter, markAllCompleted, clearCompleted, startEditing, endEditing } = todoSlice.actions;

export const selectTodos = (state: RootState) => state.todos;
export const selectFilter = (state: RootState) => state.filter;
export const selectEditingId = (state: RootState) => state.editingId;

export const selectFilteredTodos = createSelector(
  [selectTodos, selectFilter],
  (todos, filter) => {
    switch (filter) {
      case 'active': return todos.filter(todo => !todo.completed);
      case 'completed': return todos.filter(todo => todo.completed);
      default: return todos;
    }
  }
);

export const selectItemsLeft = createSelector(
  [selectTodos],
  (todos) => todos.filter(todo => !todo.completed).length
);

export const store = todoSlice.reducer;
