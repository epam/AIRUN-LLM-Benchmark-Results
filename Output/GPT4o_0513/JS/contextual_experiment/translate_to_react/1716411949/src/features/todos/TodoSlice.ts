import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodosState {
  items: Todo[];
}

const initialState: TodosState = {
  items: JSON.parse(localStorage.getItem('todos-react') || '[]'),
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.items.push({ id: nanoid(), title: action.payload, completed: false });
      localStorage.setItem('todos-react', JSON.stringify(state.items));
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.items.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        localStorage.setItem('todos-react', JSON.stringify(state.items));
      }
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(todo => todo.id !== action.payload);
      localStorage.setItem('todos-react', JSON.stringify(state.items));
    },
    updateTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.items.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
        localStorage.setItem('todos-react', JSON.stringify(state.items));
      }
    },
    clearCompleted: (state) => {
      state.items = state.items.filter(todo => !todo.completed);
      localStorage.setItem('todos-react', JSON.stringify(state.items));
    },
    toggleAllTodos: (state, action: PayloadAction<boolean>) => {
      state.items.forEach(todo => {
        todo.completed = action.payload;
      });
      localStorage.setItem('todos-react', JSON.stringify(state.items));
    },
  },
});

export const { addTodo, toggleTodo, removeTodo, updateTodo, clearCompleted, toggleAllTodos } = todosSlice.actions;

export default todosSlice.reducer;
