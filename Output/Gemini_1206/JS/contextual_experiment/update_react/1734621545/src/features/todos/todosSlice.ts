import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { Todo, FilterType } from './types';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from './constants';

interface TodosState {
  todos: Todo[];
  filter: FilterType;
}

const initialState: TodosState = {
  todos: [],
  filter: ALL_TODOS,
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer: (state, action: PayloadAction<Todo>) => {
        state.todos.push(action.payload);
      },
      prepare: (title: string) => ({
        payload: {
          id: nanoid(),
          title,
          completed: false,
        } as Todo,
      }),
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    updateTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
      }
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
    toggleAllTodos: (state, action: PayloadAction<boolean>) => {
      state.todos = state.todos.map((todo) => ({ ...todo, completed: action.payload }));
    },
    clearCompletedTodos: (state) => {
      state.todos = state.todos.filter((todo) => !todo.completed);
    },
    setFilter: (state, action: PayloadAction<FilterType>) => {
      state.filter = action.payload;
    },
  },
});

export const {
  addTodo,
  toggleTodo,
  updateTodo,
  deleteTodo,
  toggleAllTodos,
  clearCompletedTodos,
  setFilter,
} = todosSlice.actions;

export const selectFilteredTodos = (state: { todos: TodosState }) => {
  const { todos, filter } = state.todos;
  switch (filter) {
    case ACTIVE_TODOS:
      return todos.filter((todo) => !todo.completed);
    case COMPLETED_TODOS:
      return todos.filter((todo) => todo.completed);
    case ALL_TODOS:
    default:
      return todos;
  }
};

export default todosSlice.reducer;
