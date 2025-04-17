import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import { ALL_TODOS } from "./constants";
import { store as localStore } from "./utils";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export interface TodosState {
  todos: Todo[];
  nowShowing: string;
  editingId: string | null;
}

const STORAGE_KEY = "react-todos";

const initialState: TodosState = {
  todos: localStore<Todo>(STORAGE_KEY) as Todo[],
  nowShowing: ALL_TODOS,
  editingId: null,
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: {
      reducer(state, action: PayloadAction<Todo>) {
        state.todos.push(action.payload);
        localStore(STORAGE_KEY, state.todos);
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
    toggleAllTodos(state, action: PayloadAction<boolean>) {
      state.todos = state.todos.map(todo => ({ ...todo, completed: action.payload }));
      localStore(STORAGE_KEY, state.todos);
    },
    toggleTodo(state, action: PayloadAction<string>) {
      state.todos = state.todos.map(todo =>
        todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
      );
      localStore(STORAGE_KEY, state.todos);
    },
    destroyTodo(state, action: PayloadAction<string>) {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
      localStore(STORAGE_KEY, state.todos);
    },
    editTodo(state, action: PayloadAction<string>) {
      state.editingId = action.payload;
    },
    saveTodo(state, action: PayloadAction<{ id: string; title: string }>) {
      state.todos = state.todos.map(todo =>
        todo.id === action.payload.id ? { ...todo, title: action.payload.title } : todo
      );
      state.editingId = null;
      localStore(STORAGE_KEY, state.todos);
    },
    cancelEdit(state) {
      state.editingId = null;
    },
    clearCompletedTodos(state) {
      state.todos = state.todos.filter(todo => !todo.completed);
      localStore(STORAGE_KEY, state.todos);
    },
    setNowShowing(state, action: PayloadAction<string>) {
      state.nowShowing = action.payload;
    },
  },
});

export const {
  addTodo,
  toggleAllTodos,
  toggleTodo,
  destroyTodo,
  editTodo,
  saveTodo,
  cancelEdit,
  clearCompletedTodos,
  setNowShowing,
} = todosSlice.actions;

export const selectTodos = (state: { todos: TodosState }) => state.todos.todos;
export const selectNowShowing = (state: { todos: TodosState }) => state.todos.nowShowing;
export const selectEditingId = (state: { todos: TodosState }) => state.todos.editingId;

export default todosSlice.reducer;
