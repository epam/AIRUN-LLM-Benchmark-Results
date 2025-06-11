import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { Todo, Filter } from './types';

interface TodosState {
  todos: Todo[];
  filter: Filter;
  editingId: string | null;
}

const initialState: TodosState = {
  todos: [],
  filter: 'all',
  editingId: null,
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer(state, action: PayloadAction<Todo>) {
        state.todos.push(action.payload);
      },
      prepare(title: string) {
        return { payload: { id: nanoid(), title, completed: false } };
      },
    },
    toggleAll(state, action: PayloadAction<boolean>) {
      state.todos.forEach((todo) => {
        todo.completed = action.payload;
      });
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const todo = state.todos.find((t) => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    deleteTodo(state, action: PayloadAction<string>) {
      state.todos = state.todos.filter((t) => t.id !== action.payload);
    },
    editTodo(state, action: PayloadAction<string>) {
      state.editingId = action.payload;
    },
    saveTodo(state, action: PayloadAction<{ id: string; text: string }>) {
      const todo = state.todos.find((t) => t.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.text;
      }
      state.editingId = null;
    },
    cancelEdit(state) {
      state.editingId = null;
    },
    clearCompleted(state) {
      state.todos = state.todos.filter((t) => !t.completed);
    },
    setFilter(state, action: PayloadAction<Filter>) {
      state.filter = action.payload;
    },
  },
});

export const {
  addTodo,
  toggleAll,
  toggleTodo,
  deleteTodo,
  editTodo,
  saveTodo,
  cancelEdit,
  clearCompleted,
  setFilter,
} = todosSlice.actions;

export default todosSlice.reducer;
