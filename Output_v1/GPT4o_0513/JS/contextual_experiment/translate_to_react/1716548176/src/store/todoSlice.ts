import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { Todo } from '../types/todo';

interface TodoState {
  todos: Todo[];
}

const initialState: TodoState = {
  todos: JSON.parse(localStorage.getItem('todos-react') || '[]'),
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      const newTodo: Todo = {
        id: nanoid(),
        title: action.payload,
        completed: false,
      };
      state.todos.push(newTodo);
      localStorage.setItem('todos-react', JSON.stringify(state.todos));
    },
    editTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
        localStorage.setItem('todos-react', JSON.stringify(state.todos));
      }
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        localStorage.setItem('todos-react', JSON.stringify(state.todos));
      }
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      localStorage.setItem('todos-react', JSON.stringify(state.todos));
    },
    clearCompleted: (state) => {
      state.todos = state.todos.filter((todo) => !todo.completed);
      localStorage.setItem('todos-react', JSON.stringify(state.todos));
    },
    markAll: (state, action: PayloadAction<boolean>) => {
      state.todos.forEach((todo) => {
        todo.completed = action.payload;
      });
      localStorage.setItem('todos-react', JSON.stringify(state.todos));
    },
  },
});

export const { addTodo, editTodo, toggleTodo, removeTodo, clearCompleted, markAll } = todoSlice.actions;
export default todoSlice.reducer;
