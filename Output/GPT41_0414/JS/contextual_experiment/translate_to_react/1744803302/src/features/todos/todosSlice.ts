import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export interface TodosState {
  items: Todo[];
  editedTodoId: string | null;
  originalTodo: Todo | null;
  filter: 'all' | 'active' | 'completed';
}

const STORAGE_ID = 'todos-angularjs-requirejs';

function loadTodos(): Todo[] {
  try {
    const data = localStorage.getItem(STORAGE_ID);
    if (data) {
      return JSON.parse(data);
    }
  } catch {}
  return [];
}

function saveTodos(todos: Todo[]) {
  localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
}

const initialState: TodosState = {
  items: loadTodos(),
  editedTodoId: null,
  originalTodo: null,
  filter: 'all',
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer(state, action: PayloadAction<Todo>) {
        state.items.push(action.payload);
        saveTodos(state.items);
      },
      prepare(title: string) {
        return {
          payload: {
            id: nanoid(),
            title: title.trim(),
            completed: false,
          } as Todo,
        };
      },
    },
    removeTodo(state, action: PayloadAction<string>) {
      state.items = state.items.filter(todo => todo.id !== action.payload);
      saveTodos(state.items);
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const todo = state.items.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        saveTodos(state.items);
      }
    },
    editTodo(state, action: PayloadAction<string>) {
      state.editedTodoId = action.payload;
      const todo = state.items.find(t => t.id === action.payload);
      state.originalTodo = todo ? { ...todo } : null;
    },
    updateTodo(state, action: PayloadAction<{ id: string; title: string }>) {
      const todo = state.items.find(t => t.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title.trim();
        if (!todo.title) {
          state.items = state.items.filter(t => t.id !== todo.id);
        }
        saveTodos(state.items);
      }
      state.editedTodoId = null;
      state.originalTodo = null;
    },
    revertEditing(state, action: PayloadAction<string>) {
      if (state.originalTodo) {
        const idx = state.items.findIndex(t => t.id === action.payload);
        if (idx !== -1) {
          state.items[idx] = state.originalTodo;
          saveTodos(state.items);
        }
      }
      state.editedTodoId = null;
      state.originalTodo = null;
    },
    clearCompleted(state) {
      state.items = state.items.filter(todo => !todo.completed);
      saveTodos(state.items);
    },
    markAll(state, action: PayloadAction<boolean>) {
      state.items.forEach(todo => {
        todo.completed = action.payload;
      });
      saveTodos(state.items);
    },
    setFilter(state, action: PayloadAction<'all' | 'active' | 'completed'>) {
      state.filter = action.payload;
    },
    cancelEditing(state) {
      state.editedTodoId = null;
      state.originalTodo = null;
    },
  },
});

export const {
  addTodo,
  removeTodo,
  toggleTodo,
  editTodo,
  updateTodo,
  revertEditing,
  clearCompleted,
  markAll,
  setFilter,
  cancelEditing,
} = todosSlice.actions;

export default todosSlice.reducer;
