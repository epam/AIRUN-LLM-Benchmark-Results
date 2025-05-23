import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { Todo, TodoFilter } from '../../types';
import { getTodosFromLocalStorage, setTodosInLocalStorage } from '../../utils/localStorage';

interface TodosState {
  todos: Todo[];
  filter: TodoFilter;
}

const initialState: TodosState = {
  todos: getTodosFromLocalStorage(),
  filter: 'all',
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer: (state, action: PayloadAction<Todo>) => {
        state.todos.push(action.payload);
        setTodosInLocalStorage(state.todos);
      },
      prepare: (title: string) => ({
        payload: {
          id: nanoid(),
          title,
          completed: false,
        },
      }),
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        setTodosInLocalStorage(state.todos);
      }
    },
    editTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
        setTodosInLocalStorage(state.todos);
      }
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      setTodosInLocalStorage(state.todos);
    },
    clearCompletedTodos: (state) => {
      state.todos = state.todos.filter((todo) => !todo.completed);
      setTodosInLocalStorage(state.todos);
    },
    markAllTodos: (state, action: PayloadAction<boolean>) => {
      state.todos.forEach((todo) => {
        todo.completed = action.payload;
      });
      setTodosInLocalStorage(state.todos);
    },
    setFilter: (state, action: PayloadAction<TodoFilter>) => {
      state.filter = action.payload;
    },
  },
});

export const {
  addTodo,
  toggleTodo,
  editTodo,
  removeTodo,
  clearCompletedTodos,
  markAllTodos,
  setFilter,
} = todosSlice.actions;

export default todosSlice.reducer;
