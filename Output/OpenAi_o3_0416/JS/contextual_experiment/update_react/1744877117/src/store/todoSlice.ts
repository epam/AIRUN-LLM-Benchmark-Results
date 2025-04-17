import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { Todo } from '../types';
import { loadTodos, saveTodos } from '../utils/localStorage';
import { FILTER_ALL } from '../constants';

interface TodosState {
  todos: Todo[];
  filter: string;
}

const initialState: TodosState = {
  todos: loadTodos(),
  filter: FILTER_ALL,
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer(state, action: PayloadAction<Todo>) {
        state.todos.push(action.payload);
        saveTodos(state.todos);
      },
      prepare(title: string) {
        return {
          payload: {
            id: nanoid(),
            title,
            completed: false,
          } as Todo,
        };
      },
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const todo = state.todos.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        saveTodos(state.todos);
      }
    },
    deleteTodo(state, action: PayloadAction<string>) {
      state.todos = state.todos.filter(t => t.id !== action.payload);
      saveTodos(state.todos);
    },
    saveTodo(state, action: PayloadAction<{ id: string; title: string }>) {
      const todo = state.todos.find(t => t.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
        saveTodos(state.todos);
      }
    },
    toggleAll(state, action: PayloadAction<boolean>) {
      state.todos.forEach(t => {
        t.completed = action.payload;
      });
      saveTodos(state.todos);
    },
    clearCompleted(state) {
      state.todos = state.todos.filter(t => !t.completed);
      saveTodos(state.todos);
    },
    setFilter(state, action: PayloadAction<string>) {
      state.filter = action.payload;
    },
  },
});

export const {
  addTodo,
  toggleTodo,
  deleteTodo,
  saveTodo,
  toggleAll,
  clearCompleted,
  setFilter,
} = todosSlice.actions;

export default todosSlice.reducer;
