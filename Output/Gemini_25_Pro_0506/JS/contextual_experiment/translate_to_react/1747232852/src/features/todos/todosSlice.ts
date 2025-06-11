import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { Todo, FilterStatus } from './types';

interface TodosState {
  todos: Todo[];
  filter: FilterStatus;
}

const initialState: TodosState = {
  todos: JSON.parse(localStorage.getItem('todos-react') || '[]'),
  filter: FilterStatus.All,
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer: (state, action: PayloadAction<Todo>) => {
        state.todos.push(action.payload);
        localStorage.setItem('todos-react', JSON.stringify(state.todos));
      },
      prepare: (title: string) => {
        return { payload: { id: nanoid(), title, completed: false } };
      },
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
      localStorage.setItem('todos-react', JSON.stringify(state.todos));
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        localStorage.setItem('todos-react', JSON.stringify(state.todos));
      }
    },
    editTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.todos.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
        localStorage.setItem('todos-react', JSON.stringify(state.todos));
      }
    },
    clearCompletedTodos: state => {
      state.todos = state.todos.filter(todo => !todo.completed);
      localStorage.setItem('todos-react', JSON.stringify(state.todos));
    },
    markAllTodos: (state, action: PayloadAction<boolean>) => {
      state.todos.forEach(todo => {
        todo.completed = action.payload;
      });
      localStorage.setItem('todos-react', JSON.stringify(state.todos));
    },
    setFilter: (state, action: PayloadAction<FilterStatus>) => {
      state.filter = action.payload;
    },
  },
});

export const {
  addTodo,
  removeTodo,
  toggleTodo,
  editTodo,
  clearCompletedTodos,
  markAllTodos,
  setFilter,
} = todosSlice.actions;

export default todosSlice.reducer;
