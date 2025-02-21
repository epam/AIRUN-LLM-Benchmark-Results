import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ITodo } from '../../app/types';
import { uuid } from '../../utils/store';

export interface AddTodoPayload {
  title: string;
}

const initialState: ITodo[] = [];

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer: (state, action: PayloadAction<ITodo>) => {
        state.push(action.payload);
      },
      prepare: (title: string) => ({
        payload: {
          id: uuid(),
          title,
          completed: false,
        },
      }),
    },
    toggleAll(state, action: PayloadAction<boolean>) {
      state.forEach(todo => {
        todo.completed = action.payload;
      });
    },
    toggle(state, action: PayloadAction<string>) {
      const todo = state.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    destroy: (state, action: PayloadAction<string>) => {
      return state.filter(todo => todo.id !== action.payload);
    },
    saveTodo: (state, action: PayloadAction<{ id: string; text: string }>) => {
      const todo = state.find(t => t.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.text;
      }
    },
    clearCompleted: (state) => {
      return state.filter(todo => !todo.completed);
    },
  },
});

export const { addTodo, toggleAll, toggle, destroy, saveTodo, clearCompleted } = todosSlice.actions;
export default todosSlice.reducer;
