```tsx
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

const initialState: Todo[] = [];

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer(state, action: PayloadAction<Todo>) {
        state.push(action.payload);
      },
      prepare({ title }: { title: string }) {
        return { payload: { id: nanoid(), title, completed: false } };
      }
    },
    toggleAllTodos(state, action: PayloadAction<{ completed: boolean }>) {
      state.forEach(todo => {
        todo.completed = action.payload.completed;
      });
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const todo = state.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    removeTodo(state, action: PayloadAction<string>) {
      return state.filter(todo => todo.id !== action.payload);
    },
    updateTodo(state, action: PayloadAction<{ id: string; title: string }>) {
      const todo = state.find(t => t.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
      }
    },
    clearCompletedTodos(state) {
      return state.filter(todo => !todo.completed);
    }
  }
});

export const { addTodo, toggleAllTodos, toggleTodo, removeTodo, updateTodo, clearCompletedTodos } = todosSlice.actions;
export default todosSlice.reducer;
```