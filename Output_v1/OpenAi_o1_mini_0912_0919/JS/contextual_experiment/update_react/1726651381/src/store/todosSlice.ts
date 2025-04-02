import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { generateId } from '../utils/utils';
import { TodoFilters } from '../constants';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodosState {
  todos: Todo[];
  filter: TodoFilters;
}

const initialState: TodosState = {
  todos: [],
  filter: TodoFilters.ALL,
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.todos.push({ id: generateId(), title: action.payload, completed: false });
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    toggleAll: (state, action: PayloadAction<boolean>) => {
      state.todos.forEach(todo => {
        todo.completed = action.payload;
      });
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    },
    editTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.todos.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
      }
    },
    clearCompleted: (state) => {
      state.todos = state.todos.filter(todo => !todo.completed);
    },
    setFilter: (state, action: PayloadAction<TodoFilters>) => {
      state.filter = action.payload;
    },
  },
});

export const { addTodo, toggleTodo, toggleAll, deleteTodo, editTodo, clearCompleted, setFilter } = todosSlice.actions;

export default todosSlice.reducer;
