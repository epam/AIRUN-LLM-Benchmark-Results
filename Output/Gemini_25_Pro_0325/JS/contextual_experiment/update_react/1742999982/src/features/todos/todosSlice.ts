import { createSlice, PayloadAction, nanoid, createSelector } from '@reduxjs/toolkit';
import { Todo } from './types';
import { RootState } from '../../store/store';
import { StatusFilters } from '../filters/constants';

const loadState = (): Todo[] => {
  try {
    const serializedState = localStorage.getItem('react-todos');
    if (serializedState === null) {
      return [];
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return [];
  }
};

const saveState = (state: Todo[]) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('react-todos', serializedState);
  } catch {
    // ignore write errors
  }
};

const initialState: Todo[] = loadState();

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer(state, action: PayloadAction<Todo>) {
        state.push(action.payload);
        saveState(state);
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
      const todo = state.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        saveState(state);
      }
    },
    deleteTodo(state, action: PayloadAction<string>) {
      const index = state.findIndex(todo => todo.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
        saveState(state);
      }
    },
    editTodo(state, action: PayloadAction<{ id: string; title: string }>) {
      const todo = state.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
        saveState(state);
      }
    },
    clearCompleted(state) {
      const newState = state.filter(todo => !todo.completed);
      saveState(newState);
      // Redux Toolkit Immer allows direct mutation or returning new state
      return newState;
    },
    toggleAllTodos(state, action: PayloadAction<boolean>) {
      state.forEach(todo => {
        todo.completed = action.payload;
      });
      saveState(state);
    },
  },
});

export const { addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted, toggleAllTodos } = todosSlice.actions;

export default todosSlice.reducer;

// Selectors
export const selectTodos = (state: RootState) => state.todos;

export const selectActiveTodosCount = createSelector(
  selectTodos,
  (todos) => todos.reduce((count, todo) => (!todo.completed ? count + 1 : count), 0)
);

export const selectCompletedTodosCount = createSelector(
  selectTodos,
  (todos) => todos.reduce((count, todo) => (todo.completed ? count + 1 : count), 0)
);

export const selectFilteredTodos = createSelector(
  selectTodos,
  (state: RootState) => state.filters.status,
  (todos, status) => {
    if (status === StatusFilters.All) {
      return todos;
    }
    const completedStatus = status === StatusFilters.Completed;
    return todos.filter(todo => todo.completed === completedStatus);
  }
);
