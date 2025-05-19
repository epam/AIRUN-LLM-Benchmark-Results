import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { RootState } from './store';
import { Todo, FilterStatus } from './types';

interface TodosState {
  entities: Todo[];
  filter: FilterStatus;
}

const initialState: TodosState = {
  entities: [],
  filter: 'All'
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.entities.push({ id: nanoid(), title: action.payload, completed: false });
    },
    toggleTodo: (state, action: PayloadAction<{ id: string; completed?: boolean }>) => {
      if (action.payload.id === 'all') {
        state.entities.forEach(todo => (todo.completed = !!action.payload.completed));
      } else {
        const todo = state.entities.find(t => t.id === action.payload.id);
        if (todo) todo.completed = !todo.completed;
      }
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.entities = state.entities.filter(todo => todo.id !== action.payload);
    },
    updateTodo: (state, action: PayloadAction<{ id: string; changes: Partial<Todo> }>) => {
      const todo = state.entities.find(t => t.id === action.payload.id);
      if (todo) Object.assign(todo, action.payload.changes);
    },
    clearCompleted: state => {
      state.entities = state.entities.filter(todo => !todo.completed);
    },
    setFilter: (state, action: PayloadAction<FilterStatus>) => {
      state.filter = action.payload;
    }
  }
});

export const { addTodo, toggleTodo, removeTodo, updateTodo, clearCompleted, setFilter } = todoSlice.actions;

export const selectTodos = (state: RootState) => state.todos.entities;
export const selectFilteredTodos = createSelector(
  [selectTodos, (state: RootState) => state.todos.filter],
  (todos, filter) => {
    if (filter === 'Active') return todos.filter(t => !t.completed);
    if (filter === 'Completed') return todos.filter(t => t.completed);
    return todos;
  }
);

export default todoSlice.reducer;
