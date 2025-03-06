import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { Todo } from '../types';

interface TodoState {
  items: Todo[];
}

const STORAGE_KEY = 'react-todos';

const loadTodos = (): Todo[] => {
  const storedTodos = localStorage.getItem(STORAGE_KEY);
  return storedTodos ? JSON.parse(storedTodos) : [];
};

const saveTodos = (todos: Todo[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
};

const initialState: TodoState = {
  items: loadTodos()
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer: (state, action: PayloadAction<Todo>) => {
        state.items.push(action.payload);
        saveTodos(state.items);
      },
      prepare: (title: string) => ({
        payload: {
          id: nanoid(),
          title,
          completed: false
        }
      })
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.items.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        saveTodos(state.items);
      }
    },
    toggleAll: (state, action: PayloadAction<boolean>) => {
      state.items.forEach(todo => {
        todo.completed = action.payload;
      });
      saveTodos(state.items);
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(todo => todo.id !== action.payload);
      saveTodos(state.items);
    },
    editTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.items.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
        saveTodos(state.items);
      }
    },
    clearCompleted: (state) => {
      state.items = state.items.filter(todo => !todo.completed);
      saveTodos(state.items);
    }
  }
});

export const { 
  addTodo, 
  toggleTodo, 
  toggleAll, 
  removeTodo, 
  editTodo, 
  clearCompleted 
} = todoSlice.actions;

export default todoSlice.reducer;