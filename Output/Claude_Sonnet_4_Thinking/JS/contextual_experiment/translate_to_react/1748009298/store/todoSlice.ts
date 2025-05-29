import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from '@reduxjs/toolkit';
import { Todo } from '../types/todo';
import { todoStorage } from '../utils/localStorage';

export type FilterType = 'all' | 'active' | 'completed';

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
    updateTodo: (state, action: PayloadAction<{ id: string; title?: string; completed?: boolean }>) => {
      const { id, title, completed } = action.payload;
      const todo = state.todos.find(todo => todo.id === id);
      if (todo) {
        if (title !== undefined) {
          todo.title = title;
        }
        if (completed !== undefined) {
          todo.completed = completed;
        }
      }
      todoStorage.put(state.todos);
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
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
  updateTodo,
  deleteTodo,
  toggleAll,
  clearCompleted,
  setFilter
} = todoSlice.actions;

export default todoSlice.reducer;