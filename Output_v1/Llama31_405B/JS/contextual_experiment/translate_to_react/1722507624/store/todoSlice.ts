import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodoState {
  todos: Todo[];
}

const initialState: TodoState = {
  todos: JSON.parse(localStorage.getItem('todos') || '[]'),
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo(state, action: PayloadAction<string>) {
      const newTodo: Todo = {
        id: nanoid(),
        title: action.payload,
        completed: false,
      };
      state.todos.push(newTodo);
      localStorage.setItem('todos', JSON.stringify(state.todos));
    },
    removeTodo(state, action: PayloadAction<string>) {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      localStorage.setItem('todos', JSON.stringify(state.todos));
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const todo = state.todos.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
      localStorage.setItem('todos', JSON.stringify(state.todos));
    },
    clearCompleted(state) {
      state.todos = state.todos.filter((todo) => !todo.completed);
      localStorage.setItem('todos', JSON.stringify(state.todos));
    },
  },
});

export const { addTodo, removeTodo, toggleTodo, clearCompleted } = todoSlice.actions;
export default todoSlice;