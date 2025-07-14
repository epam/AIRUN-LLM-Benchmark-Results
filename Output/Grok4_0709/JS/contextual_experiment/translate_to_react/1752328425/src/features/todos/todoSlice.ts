import { createSlice, PayloadAction, nanoid, createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

type Status = 'all' | 'active' | 'completed';

interface TodoState {
  todos: Todo[];
  status: Status;
}

const initialState: TodoState = {
  todos: [],
  status: 'all',
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setTodos(state, action: PayloadAction<Todo[]>) {
      state.todos = action.payload;
    },
    addTodo: {
      reducer(state, action: PayloadAction<Todo>) {
        state.todos.push(action.payload);
      },
      prepare(title: string) {
        return {
          payload: {
            id: nanoid(),
            title,
            completed: false,
          },
        };
      },
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const todo = state.todos.find(t => t.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
    editTodo(state, action: PayloadAction<{ id: string; title: string }>) {
      const todo = state.todos.find(t => t.id === action.payload.id);
      if (todo) todo.title = action.payload.title;
    },
    removeTodo(state, action: PayloadAction<string>) {
      state.todos = state.todos.filter(t => t.id !== action.payload);
    },
    toggleAll(state, action: PayloadAction<boolean>) {
      state.todos.forEach(t => { t.completed = action.payload; });
    },
    clearCompleted(state) {
      state.todos = state.todos.filter(t => !t.completed);
    },
    setStatus(state, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
  },
});

export const { setTodos, addTodo, toggleTodo, editTodo, removeTodo, toggleAll, clearCompleted, setStatus } = todoSlice.actions;

export default todoSlice.reducer;

export const selectTodos = (state: RootState) => state.todos.todos;

export const selectStatus = (state: RootState) => state.todos.status;

export const selectFilteredTodos = createSelector(
  selectTodos,
  selectStatus,
  (todos, status) => {
    if (status === 'active') return todos.filter(t => !t.completed);
    if (status === 'completed') return todos.filter(t => t.completed);
    return todos;
  }
);

export const selectRemainingCount = createSelector(
  selectTodos,
  (todos) => todos.filter(t => !t.completed).length
);