```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { ALL_TODOS } from './constants';

export interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodoState {
  todos: ITodo[];
  nowShowing: string;
  editingId: string | null;
}

const initialState: TodoState = {
  todos: [],
  nowShowing: ALL_TODOS,
  editingId: null,
};

export const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      const id = nanoid();
      state.todos.push({ id, title: action.payload, completed: false });
    },
    toggleAll: (state, action: PayloadAction<boolean>) => {
      state.todos.forEach(todo => {
        todo.completed = action.payload;
      });
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    destroyTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(t => t.id !== action.payload);
    },
    saveTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.todos.find(t => t.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
      }
    },
    clearCompleted: (state) => {
      state.todos = state.todos.filter(t => !t.completed);
    },
    setFilter: (state, action: PayloadAction<string>) => {
      state.nowShowing = action.payload;
    },
    setEditing: (state, action: PayloadAction<string | null>) => {
      state.editingId = action.payload;
    },
  },
});

export const { addTodo, toggleAll, toggleTodo, destroyTodo, saveTodo, clearCompleted, setFilter, setEditing } = todoSlice.actions;

export default todoSlice.reducer;```