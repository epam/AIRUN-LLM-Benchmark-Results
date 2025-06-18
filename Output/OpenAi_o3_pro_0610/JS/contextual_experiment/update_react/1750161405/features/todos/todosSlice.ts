import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../../constants';
import { loadTodos, saveTodos } from '../../utils/localStorage';
import { RootState } from '../../store';
import { Todo } from '../../types';

export type Filter = typeof ALL_TODOS | typeof ACTIVE_TODOS | typeof COMPLETED_TODOS;

interface TodosState {
  todos: Todo[];
  filter: Filter;
  editingId: string | null;
}

const initialState: TodosState = {
  todos: loadTodos(),
  filter: ALL_TODOS,
  editingId: null,
};

const persist = (state: TodosState) => {
  saveTodos(state.todos);
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    add: {
      reducer(state, action: PayloadAction<Todo>) {
        state.todos.push(action.payload);
        persist(state);
      },
      prepare(title: string) {
        return { payload: { id: nanoid(), title, completed: false } as Todo };
      },
    },
    toggleAll(state, action: PayloadAction<boolean>) {
      state.todos.forEach((t) => {
        t.completed = action.payload;
      });
      persist(state);
    },
    toggle(state, action: PayloadAction<string>) {
      const todo = state.todos.find((t) => t.id === action.payload);
      if (todo) todo.completed = !todo.completed;
      persist(state);
    },
    destroy(state, action: PayloadAction<string>) {
      state.todos = state.todos.filter((t) => t.id !== action.payload);
      persist(state);
    },
    startEditing(state, action: PayloadAction<string>) {
      state.editingId = action.payload;
    },
    cancelEditing(state) {
      state.editingId = null;
    },
    save(state, action: PayloadAction<{ id: string; title: string }>) {
      const todo = state.todos.find((t) => t.id === action.payload.id);
      if (todo) todo.title = action.payload.title;
      persist(state);
    },
    clearCompleted(state) {
      state.todos = state.todos.filter((t) => !t.completed);
      persist(state);
    },
    setFilter(state, action: PayloadAction<Filter>) {
      state.filter = action.payload;
    },
  },
});

export const {
  add,
  toggleAll,
  toggle,
  destroy,
  startEditing,
  cancelEditing,
  save,
  clearCompleted,
  setFilter,
} = todosSlice.actions;

export default todosSlice.reducer;

// Selectors
const selectTodosState = (state: RootState) => state.todos;
export const selectTodos = (state: RootState) => selectTodosState(state).todos;
export const selectFilter = (state: RootState) => selectTodosState(state).filter;
export const selectEditingId = (state: RootState) => selectTodosState(state).editingId;

export const selectFilteredTodos = createSelector(
  selectTodos,
  selectFilter,
  (todos, filter) => {
    switch (filter) {
      case ACTIVE_TODOS:
        return todos.filter((t) => !t.completed);
      case COMPLETED_TODOS:
        return todos.filter((t) => t.completed);
      default:
        return todos;
    }
  }
);

export const selectActiveCount = createSelector(
  selectTodos,
  (todos) => todos.filter((t) => !t.completed).length
);

export const selectCompletedCount = createSelector(
  selectTodos,
  (todos) => todos.filter((t) => t.completed).length
);
