import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { Utils } from '../utils';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodoState {
  todos: Todo[];
}

const initialState: TodoState = {
  todos: Utils.store('react-todos')
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer(state, action: PayloadAction<Todo>) {
        state.todos.push(action.payload);
        Utils.store('react-todos', state.todos);
      },
      prepare(title: string) {
        return { payload: { id: nanoid(), title, completed: false } };
      }
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        Utils.store('react-todos', state.todos);
      }
    },
    toggleAll(state, action: PayloadAction<boolean>) {
      state.todos.forEach(todo => (todo.completed = action.payload));
      Utils.store('react-todos', state.todos);
    },
    destroyTodo(state, action: PayloadAction<string>) {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
      Utils.store('react-todos', state.todos);
    },
    saveTodo(state, action: PayloadAction<{ id: string; title: string }>) {
      const todo = state.todos.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
        Utils.store('react-todos', state.todos);
      }
    },
    clearCompleted(state) {
      state.todos = state.todos.filter(todo => !todo.completed);
      Utils.store('react-todos', state.todos);
    }
  }
});

export const { addTodo, toggleTodo, toggleAll, destroyTodo, saveTodo, clearCompleted } = todoSlice.actions;
export default todoSlice.reducer;