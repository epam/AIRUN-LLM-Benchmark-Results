import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { Todo, FilterType } from '../types/todo';
import { todoStorage } from '../utils/localStorage';

interface TodoState {
  todos: Todo[];
  filter: FilterType;
}

const initialState: TodoState = {
  todos: todoStorage.get(),
  filter: 'all'
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      const newTodo: Todo = {
        id: nanoid(),
        title: action.payload,
        completed: false
      };
      state.todos.push(newTodo);
      todoStorage.put(state.todos);
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        todoStorage.put(state.todos);
      }
    },
    updateTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.todos.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
        todoStorage.put(state.todos);
      }
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
      todoStorage.put(state.todos);
    },
    toggleAll: (state, action: PayloadAction<boolean>) => {
      state.todos.forEach(todo => {
        todo.completed = action.payload;
      });
      todoStorage.put(state.todos);
    },
    clearCompleted: (state) => {
      state.todos = state.todos.filter(todo => !todo.completed);
      todoStorage.put(state.todos);
    },
    setFilter: (state, action: PayloadAction<FilterType>) => {
      state.filter = action.payload;
    }
  }
});

export const {
  addTodo,
  toggleTodo,
  updateTodo,
  removeTodo,
  toggleAll,
  clearCompleted,
  setFilter
} = todoSlice.actions;

export default todoSlice.reducer;
