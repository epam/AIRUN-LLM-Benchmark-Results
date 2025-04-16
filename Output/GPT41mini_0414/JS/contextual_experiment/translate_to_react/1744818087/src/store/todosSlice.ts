import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export interface TodosState {
  todos: Todo[];
  editedTodoId: string | null;
  originalTitle: string | null;
  filter: 'all' | 'active' | 'completed';
}

const STORAGE_ID = 'todos-react-redux-toolkit';

const loadTodos = (): Todo[] => {
  const stored = localStorage.getItem(STORAGE_ID);
  if (stored) {
    try {
      return JSON.parse(stored) as Todo[];
    } catch {
      return [];
    }
  }
  return [];
};

const saveTodos = (todos: Todo[]) => {
  localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
};

const initialState: TodosState = {
  todos: loadTodos(),
  editedTodoId: null,
  originalTitle: null,
  filter: 'all',
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo(state, action: PayloadAction<string>) {
      const title = action.payload.trim();
      if (title.length === 0) return;
      state.todos.push({ id: nanoid(), title, completed: false });
      saveTodos(state.todos);
    },
    removeTodo(state, action: PayloadAction<string>) {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
      saveTodos(state.todos);
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const todo = state.todos.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        saveTodos(state.todos);
      }
    },
    editTodoStart(state, action: PayloadAction<string>) {
      const todo = state.todos.find(t => t.id === action.payload);
      if (todo) {
        state.editedTodoId = todo.id;
        state.originalTitle = todo.title;
      }
    },
    editTodoCancel(state) {
      if (state.editedTodoId && state.originalTitle !== null) {
        const todo = state.todos.find(t => t.id === state.editedTodoId);
        if (todo) {
          todo.title = state.originalTitle;
        }
      }
      state.editedTodoId = null;
      state.originalTitle = null;
    },
    editTodoDone(state, action: PayloadAction<{ id: string; title: string }>) {
      const { id, title } = action.payload;
      const todo = state.todos.find(t => t.id === id);
      if (todo) {
        const trimmedTitle = title.trim();
        if (trimmedTitle.length === 0) {
          state.todos = state.todos.filter(t => t.id !== id);
        } else {
          todo.title = trimmedTitle;
        }
        saveTodos(state.todos);
      }
      state.editedTodoId = null;
      state.originalTitle = null;
    },
    clearCompleted(state) {
      state.todos = state.todos.filter(t => !t.completed);
      saveTodos(state.todos);
    },
    toggleAll(state, action: PayloadAction<boolean>) {
      state.todos.forEach(todo => {
        todo.completed = action.payload;
      });
      saveTodos(state.todos);
    },
    setFilter(state, action: PayloadAction<'all' | 'active' | 'completed'>) {
      state.filter = action.payload;
    },
  },
});

export const {
  addTodo,
  removeTodo,
  toggleTodo,
  editTodoStart,
  editTodoCancel,
  editTodoDone,
  clearCompleted,
  toggleAll,
  setFilter,
} = todosSlice.actions;

export default todosSlice.reducer;
