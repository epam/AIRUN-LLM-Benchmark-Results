import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { Todo, TodoFilter } from '../../types';

const initialState: { todos: Todo[]; filter: TodoFilter } = {
  todos: [],
  filter: 'all',
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer(state, action: PayloadAction<{ title: string; id: string; completed: boolean; createdAt: string }>) {
        state.todos.push(action.payload);
      },
      prepare(title: string) {
        return {
          payload: {
            id: nanoid(),
            title,
            completed: false,
            createdAt: new Date().toISOString(),
          },
        };
      },
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const todo = state.todos.find(t => t.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
    toggleAll(state, action: PayloadAction<boolean>) {
      state.todos.forEach(todo => todo.completed = action.payload);
    },
    deleteTodo(state, action: PayloadAction<string>) {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    },
    updateTodo(state, action: PayloadAction<{ id: string; changes: Partial<Todo> }>) {
      const index = state.todos.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.todos[index] = { ...state.todos[index], ...action.payload.changes };
      }
    },
    clearCompleted(state) {
      state.todos = state.todos.filter(todo => !todo.completed);
    },
    setFilter(state, action: PayloadAction<TodoFilter>) {
      state.filter = action.payload;
    },
  },
});

export const { addTodo, toggleTodo, toggleAll, deleteTodo, updateTodo, clearCompleted, setFilter } = todosSlice.actions;

export const selectFilteredTodos = (state: { todos: { todos: Todo[]; filter: TodoFilter } }) => {
  const { todos, filter } = state.todos;
  switch (filter) {
    case 'active':
      return todos.filter(todo => !todo.completed);
    case 'completed':
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};

export default todosSlice.reducer;