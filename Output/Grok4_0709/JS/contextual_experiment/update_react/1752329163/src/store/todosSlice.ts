import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { Todo } from '../types/todo';

const loadInitialTodos = (): Todo[] => {
  const stored = localStorage.getItem('react-todos');
  return stored ? JSON.parse(stored) : [];
};

interface TodosState {
  todos: Todo[];
}

const initialState: TodosState = {
  todos: loadInitialTodos(),
};

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.todos.push({ id: nanoid(), title: action.payload, completed: false });
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(t => t.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
    toggleAll: (state, action: PayloadAction<boolean>) => {
      state.todos.forEach(todo => { todo.completed = action.payload; });
    },
    destroyTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(t => t.id !== action.payload);
    },
    saveTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.todos.find(t => t.id === action.payload.id);
      if (todo) todo.title = action.payload.title;
    },
    clearCompleted: state => {
      state.todos = state.todos.filter(t => !t.completed);
    },
  },
});

export const { addTodo, toggleTodo, toggleAll, destroyTodo, saveTodo, clearCompleted } = todosSlice.actions;

export default todosSlice.reducer;