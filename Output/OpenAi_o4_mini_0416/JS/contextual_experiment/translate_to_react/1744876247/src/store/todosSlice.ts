```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { Todo, Filter } from '../types';

interface TodosState {
  todos: Todo[];
  filter: Filter;
}

const STORAGE_KEY = 'todos-angularjs-requirejs';

const loadTodos = (): Todo[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveTodos = (todos: Todo[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
};

const initialState: TodosState = {
  todos: loadTodos(),
  filter: 'all',
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
        return { payload: { id: nanoid(), title, completed: false } };
      },
    },
    toggleCompleted(state, action: PayloadAction<string>) {
      const todo = state.todos.find((t) => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        saveTodos(state.todos);
      }
    },
    editTodo(state, action: PayloadAction<{ id: string; title: string }>) {
      const todo = state.todos.find((t) => t.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
        saveTodos(state.todos);
      }
    },
    removeTodo(state, action: PayloadAction<string>) {
      state.todos = state.todos.filter((t) => t.id !== action.payload);
      saveTodos(state.todos);
    },
    clearCompleted(state) {
      state.todos = state.todos.filter((t) => !t.completed);
      saveTodos(state.todos);
    },
    markAll(state, action: PayloadAction<boolean>) {
      state.todos.forEach((t) => (t.completed = action.payload));
      saveTodos(state.todos);
    },
    setFilter(state, action: PayloadAction<Filter>) {
      state.filter = action.payload;
    },
  },
});

export const { addTodo, toggleCompleted, editTodo, removeTodo, clearCompleted, markAll, setFilter } = todosSlice.actions;
export default todosSlice.reducer;
```