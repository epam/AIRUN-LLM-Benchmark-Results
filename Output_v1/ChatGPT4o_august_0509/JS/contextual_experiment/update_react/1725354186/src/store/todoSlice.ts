import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { ITodo } from '../types';

interface TodosState {
  todos: ITodo[];
}

const initialState: TodosState = {
  todos: [],
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer(state, action: PayloadAction<ITodo>) {
        state.todos.push(action.payload);
      },
      prepare(title: string) {
        return {
          payload: {
            id: nanoid(),
            title,
            completed: false,
          },
        };
      },
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const todo = state.todos.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    toggleAll(state, action: PayloadAction<boolean>) {
      state.todos.forEach((todo) => {
        todo.completed = action.payload;
      });
    },
    destroyTodo(state, action: PayloadAction<string>) {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
    saveTodo(state, action: PayloadAction<{ id: string; title: string }>) {
      const todo = state.todos.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
      }
    },
    clearCompleted(state) {
      state.todos = state.todos.filter((todo) => !todo.completed);
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
} = todoSlice.actions;

export default todoSlice.reducer;
