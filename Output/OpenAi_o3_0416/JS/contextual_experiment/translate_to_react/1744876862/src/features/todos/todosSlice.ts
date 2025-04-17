import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { Todo, Filter } from '../../types';

const STORAGE_KEY = 'todos-react-ts';

const loadFromStorage = (): Todo[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Todo[]) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (todos: Todo[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    /* ignore */
  }
};

interface TodosState {
  items: Todo[];
  filter: Filter;
}

const initialState: TodosState = {
  items: loadFromStorage(),
  filter: 'all',
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer(state, action: PayloadAction<Todo>) {
        state.items.push(action.payload);
        saveToStorage(state.items);
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
      const todo = state.items.find((t) => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        saveToStorage(state.items);
      }
    },
    updateTodo(state, action: PayloadAction<{ id: string; title: string }>) {
      const { id, title } = action.payload;
      const todo = state.items.find((t) => t.id === id);
      if (todo) {
        todo.title = title;
        saveToStorage(state.items);
      }
    },
    removeTodo(state, action: PayloadAction<string>) {
      state.items = state.items.filter((t) => t.id !== action.payload);
      saveToStorage(state.items);
    },
    toggleAll(state, action: PayloadAction<boolean>) {
      state.items.forEach((t) => {
        t.completed = action.payload;
      });
      saveToStorage(state.items);
    },
    clearCompleted(state) {
      state.items = state.items.filter((t) => !t.completed);
      saveToStorage(state.items);
    },
    setFilter(state, action: PayloadAction<Filter>) {
      state.filter = action.payload;
    },
  },
});

export const {
  addTodo,
  toggleTodo,
  updateTodo,
  removeTodo,
  toggleAll,
  clearCompleted,
  setFilter,
} = todosSlice.actions;

export default todosSlice.reducer;
