import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}

interface ITodoState {
  todos: ITodo[];
}

const initialState: ITodoState = {
  todos: [],
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer(state, action: PayloadAction<ITodo>) {
        state.todos.push(action.payload);
      },
      prepare(title: string) {
        return { payload: { id: nanoid(), title, completed: false } };
      },
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    destroyTodo(state, action: PayloadAction<string>) {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    },
    clearCompleted(state) {
      state.todos = state.todos.filter(todo => !todo.completed);
    },
  },
});

export const { addTodo, toggleTodo, destroyTodo, clearCompleted } = todoSlice.actions;
export default todoSlice.reducer;