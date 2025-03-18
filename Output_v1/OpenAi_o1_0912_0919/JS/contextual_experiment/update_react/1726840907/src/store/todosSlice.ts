import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

interface Todo {
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
        return {
          payload: {
            id: nanoid(),
            title,
            completed: false
          },
        };
      },
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const todo = state.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    toggleAll(state, action: PayloadAction<boolean>) {
      state.forEach((todo) => {
        todo.completed = action.payload;
      });
    },
    destroyTodo(state, action: PayloadAction<string>) {
      return state.filter((todo) => todo.id !== action.payload);
    },
    saveTodo(state, action: PayloadAction<{ id: string; title: string }>) {
      const todo = state.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
      }
    },
    clearCompleted(state) {
      return state.filter((todo) => !todo.completed);
    },
  },
});

export const {
  addTodo,
  toggleTodo,
  toggleAll,
  destroyTodo,
  saveTodo,
  clearCompleted,
} = todosSlice.actions;

export default todosSlice.reducer;
