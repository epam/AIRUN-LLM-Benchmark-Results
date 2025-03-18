import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { Todo } from '../types';

interface TodoState {
  todos: Todo[];
}

// Load todos from localStorage
const loadTodos = (): Todo[] => {
  const storedTodos = localStorage.getItem('react-todos');
  return storedTodos ? JSON.parse(storedTodos) : [];
};

const initialState: TodoState = {
  todos: loadTodos(),
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer: (state, action: PayloadAction<Todo>) => {
        state.todos.push(action.payload);
        localStorage.setItem('react-todos', JSON.stringify(state.todos));
      },
      prepare: (title: string) => ({
        payload: {
          id: nanoid(),
          title: title.trim(),
          completed: false,
        },
      }),
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        localStorage.setItem('react-todos', JSON.stringify(state.todos));
      }
    },
    toggleAllTodos: (state, action: PayloadAction<boolean>) => {
      state.todos.forEach(todo => {
        todo.completed = action.payload;
      });
      localStorage.setItem('react-todos', JSON.stringify(state.todos));
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
      localStorage.setItem('react-todos', JSON.stringify(state.todos));
    },
    updateTodoTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.todos.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
        localStorage.setItem('react-todos', JSON.stringify(state.todos));
      }
    },
    clearCompleted: (state) => {
      state.todos = state.todos.filter(todo => !todo.completed);
      localStorage.setItem('react-todos', JSON.stringify(state.todos));
    },
  },
});

export const { 
  addTodo, 
  toggleTodo, 
  toggleAllTodos, 
  deleteTodo, 
  updateTodoTitle, 
  clearCompleted 
} = todoSlice.actions;

export default todoSlice.reducer;