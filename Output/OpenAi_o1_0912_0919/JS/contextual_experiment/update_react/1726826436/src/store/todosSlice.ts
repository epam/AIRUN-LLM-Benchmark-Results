import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { Utils } from '../utils';

interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}

const initialState: ITodo[] = Utils.store('react-todos');

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer(state, action: PayloadAction<ITodo>) {
        state.push(action.payload);
        Utils.store('react-todos', state);
      },
      prepare(title: string) {
        return {
          payload: {
            id: nanoid(),
            title,
            completed: false,
          } as ITodo,
        };
      },
    },
    toggleAll(state, action: PayloadAction<boolean>) {
      state.forEach((todo) => {
        todo.completed = action.payload;
      });
      Utils.store('react-todos', state);
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const todo = state.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        Utils.store('react-todos', state);
      }
    },
    destroyTodo(state, action: PayloadAction<string>) {
      const index = state.findIndex((todo) => todo.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
        Utils.store('react-todos', state);
      }
    },
    saveTodo(state, action: PayloadAction<{ id: string; title: string }>) {
      const todo = state.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
        Utils.store('react-todos', state);
      }
    },
    clearCompleted(state) {
      const newState = state.filter((todo) => !todo.completed);
      Utils.store('react-todos', newState);
      return newState;
    },
  },
});

export const {
  addTodo,
  toggleAll,
  toggleTodo,
  destroyTodo,
  saveTodo,
  clearCompleted,
} = todosSlice.actions;

export default todosSlice.reducer;
