import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { Todo } from '../../types';

const getInitialTodos = () => {
  const storedTodos = localStorage.getItem('todos-react-redux-ts');
  return storedTodos ? JSON.parse(storedTodos) : [];
};

const initialState: { todos: Todo[] } = {
  todos: getInitialTodos(),
};

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer: (state, action: PayloadAction<Todo>) => {
        state.todos.push(action.payload);
        localStorage.setItem('todos-react-redux-ts', JSON.stringify(state.todos));
      },
      prepare: (title: string) => ({
        payload: {
          id: nanoid(),
          title,
          completed: false,
        } as Todo,
      }),
    },
    toggleComplete: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        localStorage.setItem('todos-react-redux-ts', JSON.stringify(state.todos));
      }
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      localStorage.setItem('todos-react-redux-ts', JSON.stringify(state.todos));
    },
    editTodo: (state, action: PayloadAction<{ id: string, title: string }>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
        localStorage.setItem('todos-react-redux-ts', JSON.stringify(state.todos));
      }
    },
    clearCompleted: (state) => {
      state.todos = state.todos.filter((todo) => !todo.completed);
      localStorage.setItem('todos-react-redux-ts', JSON.stringify(state.todos));
    },
    markAllComplete: (state, action: PayloadAction<boolean>) => {
      state.todos.forEach(todo => todo.completed = action.payload);
      localStorage.setItem('todos-react-redux-ts', JSON.stringify(state.todos));
    },
  },
});

export const {
  addTodo,
  toggleComplete,
  removeTodo,
  editTodo,
  clearCompleted,
  markAllComplete
} = todosSlice.actions;

export default todosSlice.reducer;
