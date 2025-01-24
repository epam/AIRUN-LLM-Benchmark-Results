import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { Todo } from '../types';

const STORAGE_ID = 'todos-react-ts';

const loadTodos = (): Todo[] => {
  try {
    const storedTodos = localStorage.getItem(STORAGE_ID);
    return storedTodos ? JSON.parse(storedTodos) : [];
  } catch {
    return [];
  }
};

const saveTodos = (todos: Todo[]) => {
  localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
};

const initialState: Todo[] = loadTodos();

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer: (state, action: PayloadAction<Todo>) => {
        state.push(action.payload);
        saveTodos(state);
      },
      prepare: (title: string) => ({
        payload: {
          id: nanoid(),
          title,
          completed: false,
        } as Todo,
      }),
    },
    editTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.find((t) => t.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
        saveTodos(state);
      }
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      const index = state.findIndex((todo) => todo.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
        saveTodos(state);
      }
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.find((t) => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        saveTodos(state);
      }
    },
    toggleAll: (state, action: PayloadAction<boolean>) => {
      state.forEach((todo) => {
        todo.completed = action.payload;
      });
      saveTodos(state);
    },
    clearCompleted: (state) => {
      const newState = state.filter((todo) => !todo.completed);
      saveTodos(newState);
      return newState;
    },
  },
});

export const { addTodo, editTodo, removeTodo, toggleTodo, toggleAll, clearCompleted } = todoSlice.actions;
export default todoSlice.reducer;
