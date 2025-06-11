import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { Todo } from '../types';

const getInitialTodos = (): Todo[] => {
  try {
    const savedTodos = localStorage.getItem('react-todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  } catch (error) {
    console.error("Failed to parse todos from localStorage", error);
    return [];
  }
};

const initialState: Todo[] = getInitialTodos();

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer: (state, action: PayloadAction<Todo>) => {
        state.push(action.payload);
      },
      prepare: (title: string) => ({
        payload: {
          id: nanoid(),
          title,
          completed: false,
        },
      }),
    },
    toggleAll(state, action: PayloadAction<boolean>) {
      for (const todo of state) {
        todo.completed = action.payload;
      }
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const todo = state.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    saveTodo(state, action: PayloadAction<{ id: string; title: string }>) {
      const todo = state.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
      }
    },
    destroyTodo(state, action: PayloadAction<string>) {
      return state.filter(todo => todo.id !== action.payload);
    },
    clearCompleted(state) {
      return state.filter(todo => !todo.completed);
    },
  },
});

export const {
  addTodo,
  toggleAll,
  toggleTodo,
  saveTodo,
  destroyTodo,
  clearCompleted,
} = todosSlice.actions;

export default todosSlice.reducer;
