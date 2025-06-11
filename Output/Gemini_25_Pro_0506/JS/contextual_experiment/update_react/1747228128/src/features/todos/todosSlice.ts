import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { Todo, TodosState } from './types';
import { loadState } from '../../utils/localStorage';
import { LOCAL_STORAGE_KEY } from '../../constants';

const persistedTodos = loadState<{ todos: TodosState }>(LOCAL_STORAGE_KEY)?.todos.todos || [];

const initialState: TodosState = {
  todos: persistedTodos,
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer: (state, action: PayloadAction<Todo>) => {
        state.todos.push(action.payload);
      },
      prepare: (title: string) => {
        return {
          payload: {
            id: nanoid(),
            title,
            completed: false,
          },
        };
      },
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    destroyTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    },
    editTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.todos.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
      }
    },
    toggleAllTodos: (state, action: PayloadAction<boolean>) => {
      state.todos.forEach(todo => {
        todo.completed = action.payload;
      });
    },
    clearCompletedTodos: state => {
      state.todos = state.todos.filter(todo => !todo.completed);
    },
  },
});

export const {
  addTodo,
  toggleTodo,
  destroyTodo,
  editTodo,
  toggleAllTodos,
  clearCompletedTodos,
} = todosSlice.actions;

export default todosSlice.reducer;