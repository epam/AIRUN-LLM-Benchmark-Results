```ts
import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';

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
      prepare(title: string) {
        return { payload: { id: nanoid(), title: title.trim(), completed: false } };
      }
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const todo = state.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    updateTodo(state, action: PayloadAction<{ id: string; title: string }>) {
      const { id, title } = action.payload;
      const todo = state.find(todo => todo.id === id);
      if (todo) {
        todo.title = title.trim();
      }
    },
    removeTodo(state, action: PayloadAction<string>) {
      return state.filter(todo => todo.id !== action.payload);
    },
    markAll(state, action: PayloadAction<boolean>) {
      state.forEach(todo => {
        todo.completed = action.payload;
      });
    },
    clearCompleted(state) {
      return state.filter(todo => !todo.completed);
    }
  }
});

export const { addTodo, toggleTodo, updateTodo, removeTodo, markAll, clearCompleted } = todosSlice.actions;

export default todosSlice.reducer;
```