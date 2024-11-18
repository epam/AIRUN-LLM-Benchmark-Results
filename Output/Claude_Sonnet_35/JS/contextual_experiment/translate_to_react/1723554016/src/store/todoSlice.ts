import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { Todo } from '../types/todo';

interface TodoState {
  list: Todo[];
}

const STORAGE_KEY = 'todos-react-redux';

const loadTodos = (): Todo[] => {
  const storedTodos = localStorage.getItem(STORAGE_KEY);
  return storedTodos ? JSON.parse(storedTodos) : [];
};

const saveTodos = (todos: Todo[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
};

const initialState: TodoState = {
  list: loadTodos(),
};

export const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      const newTodo: Todo = {
        id: nanoid(),
        title: action.payload,
        completed: false,
      };
      state.list.push(newTodo);
      saveTodos(state.list);
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.list.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        saveTodos(state.list);
      }
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(todo => todo.id !== action.payload);
      saveTodos(state.list);
    },
    editTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.list.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
        saveTodos(state.list);
      }
    },
    clearCompleted: (state) => {
      state.list = state.list.filter(todo => !todo.completed);
      saveTodos(state.list);
    },
    toggleAll: (state, action: PayloadAction<boolean>) => {
      state.list.forEach(todo => todo.completed = action.payload);
      saveTodos(state.list);
    },
  },
});

export const { addTodo, toggleTodo, removeTodo, editTodo, clearCompleted, toggleAll } = todoSlice.actions;

export default todoSlice.reducer;
