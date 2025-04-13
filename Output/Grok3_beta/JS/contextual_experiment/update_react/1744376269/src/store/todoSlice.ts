import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { ITodo, ITodoState } from '../types';
import { Utils } from '../utils';

const initialState: ITodoState = {
  todos: Utils.store('react-todos'),
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer: (state, action: PayloadAction<ITodo>) => {
        state.todos.push(action.payload);
        Utils.store('react-todos', state.todos);
      },
      prepare: (title: string) => ({
        payload: {
          id: nanoid(),
          title,
          completed: false,
        },
      }),
    },
    toggleAll: (state, action: PayloadAction<boolean>) => {
      state.todos = state.todos.map(todo => ({
        ...todo,
        completed: action.payload,
      }));
      Utils.store('react-todos', state.todos);
    },
    toggle: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.map(todo =>
        todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
      );
      Utils.store('react-todos', state.todos);
    },
    destroy: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
      Utils.store('react-todos', state.todos);
    },
    save: (state, action: PayloadAction<{ id: string; text: string }>) => {
      state.todos = state.todos.map(todo =>
        todo.id === action.payload.id ? { ...todo, title: action.payload.text } : todo
      );
      Utils.store('react-todos', state.todos);
    },
    clearCompleted: (state) => {
      state.todos = state.todos.filter(todo => !todo.completed);
      Utils.store('react-todos', state.todos);
    },
  },
});

export const { addTodo, toggleAll, toggle, destroy, save, clearCompleted } = todoSlice.actions;
export default todoSlice.reducer;