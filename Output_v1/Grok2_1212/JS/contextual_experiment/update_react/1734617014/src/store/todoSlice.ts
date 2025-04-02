```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { ITodo } from '../types';

const todoSlice = createSlice({
  name: 'todos',
  initialState: [] as ITodo[],
  reducers: {
    addTodo: {
      reducer: (state, action: PayloadAction<{ id: string; title: string }>) => {
        state.push(action.payload);
      },
      prepare: (title: string) => ({
        payload: { id: nanoid(), title, completed: false }
      })
    },
    toggleAll: (state, action: PayloadAction<boolean>) => {
      state.forEach(todo => {
        todo.completed = action.payload;
      });
    },
    toggle: (state, action: PayloadAction<string>) => {
      const todo = state.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    destroy: (state, action: PayloadAction<string>) => {
      return state.filter(todo => todo.id !== action.payload);
    },
    save: (state, action: PayloadAction<{ id: string; text: string }>) => {
      const todo = state.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.text;
      }
    },
    clearCompleted: (state) => {
      return state.filter(todo => !todo.completed);
    }
  }
});

export const { addTodo, toggleAll, toggle, destroy, save, clearCompleted } = todoSlice.actions;
export default todoSlice.reducer;
```