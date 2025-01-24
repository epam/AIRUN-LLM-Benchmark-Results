```ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import { ITodo } from "../types";

const initialState: ITodo[] = [];

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: {
      reducer(state, action: PayloadAction<{ id: string; title: string }>) {
        state.push({ id: action.payload.id, title: action.payload.title, completed: false });
      },
      prepare(title: string) {
        return { payload: { id: nanoid(), title } };
      }
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const todo = state.find((t) => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    removeTodo(state, action: PayloadAction<string>) {
      return state.filter((t) => t.id !== action.payload);
    },
    saveTodo(state, action: PayloadAction<{ id: string; title: string }>) {
      const todo = state.find((t) => t.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
      }
    },
    clearCompleted(state) {
      return state.filter((t) => !t.completed);
    },
    toggleAllTodos(state, action: PayloadAction<boolean>) {
      state.forEach((t) => {
        t.completed = action.payload;
      });
    }
  }
});

export const {
  addTodo,
  toggleTodo,
  removeTodo,
  saveTodo,
  clearCompleted,
  toggleAllTodos
} = todosSlice.actions;

export default todosSlice.reducer;
```