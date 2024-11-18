import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { RootState } from './index';

export interface ITodo {
  id: string;
  title: string;
  completed: boolean;
  editing?: boolean;
}

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE',
};

interface ITodosState {
  todos: ITodo[];
  visibilityFilter: string;
}

const initialState: ITodosState = {
  todos: [],
  visibilityFilter: VisibilityFilters.SHOW_ALL,
};

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<ITodo>) => {
      state.todos.push({
        id: nanoid(),
        ...action.payload,
      });
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find((t) => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    toggleAll: (state, action: PayloadAction<boolean>) => {
      state.todos.forEach((todo) => {
        todo.completed = action.payload;
      });
    },
    destroyTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
    editTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find((t) => t.id === action.payload);
      if (todo) {
        todo.editing = true;
      }
    },
    saveTodo: (state, action: PayloadAction<{ id: string; text: string }>) => {
      const todo = state.todos.find((t) => t.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.text;
        todo.editing = false;
      }
    },
    clearCompleted: (state) => {
      state.todos = state.todos.filter((todo) => !todo.completed);
    },
    setVisibilityFilter: (state, action: PayloadAction<string>) => {
      state.visibilityFilter = action.payload;
    },
  },
});

export const {
  addTodo,
  toggleTodo,
  toggleAll,
  destroyTodo,
  editTodo,
  saveTodo,
  clearCompleted,
  setVisibilityFilter,
} = todosSlice.actions;

export const selectVisibleTodos = (state: RootState) => {
  switch (state.todos.visibilityFilter) {
    case VisibilityFilters.SHOW_COMPLETED:
      return state.todos.todos.filter((todo) => todo.completed);
    case VisibilityFilters.SHOW_ACTIVE:
      return state.todos.todos.filter((todo) => !todo.completed);
    default:
      return state.todos.todos;
  }
};

export default todosSlice.reducer;
