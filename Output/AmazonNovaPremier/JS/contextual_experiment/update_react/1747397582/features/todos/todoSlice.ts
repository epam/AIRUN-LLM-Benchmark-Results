import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { RootState } from '../../app/rootReducer';
import { loadState, saveState } from '../../utils/localStorage';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodosState {
  todos: Todo[];
}

const initialState: TodosState = {
  todos: loadState('todos') || [],
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.todos.push({ id: nanoid(), title: action.payload, completed: false });
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
    updateTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload.id);
      if (todo) todo.title = action.payload.title;
    },
    toggleAll: (state, action: PayloadAction<boolean>) => {
      state.todos.forEach((todo) => (todo.completed = action.payload));
    },
    clearCompleted: (state) => {
      state.todos = state.todos.filter((todo) => !todo.completed);
    },
  },
});

export const { addTodo, toggleTodo, removeTodo, updateTodo, toggleAll, clearCompleted } = todoSlice.actions;

export const selectTodos = (state: RootState) => state.todos.todos;
export const selectActiveCount = createSelector(selectTodos, (todos) => todos.filter((todo) => !todo.completed).length);
export const selectCompletedCount = createSelector(selectTodos, (todos) => todos.filter((todo) => todo.completed).length);

export const selectFilteredTodos = createSelector([selectTodos, (state: RootState) => state.filter.status], (todos, filter) => {
  switch (filter) {
    case 'active':
      return todos.filter((todo) => !todo.completed);
    case 'completed':
      return todos.filter((todo) => todo.completed);
    default:
      return todos;
  }
});

export default todoSlice.reducer;