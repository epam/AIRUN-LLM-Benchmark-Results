import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { ITodo } from '../../types';

interface TodosState {
  todos: ITodo[];
  editingId: string | null;
}

const initialState: TodosState = {
  todos: [],
  editingId: null,
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer: (state, action: PayloadAction<ITodo>) => {
        state.todos.push(action.payload);
      },
      prepare: (title: string) => {
        const id = nanoid();
        return { payload: { id, title, completed: false } };
      },
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find((t) => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
    editTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.todos.find((t) => t.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
      }
    },
    toggleAll: (state, action: PayloadAction<boolean>) => {
      state.todos.forEach((todo) => {
        todo.completed = action.payload;
      });
    },
    clearCompleted: (state) => {
      state.todos = state.todos.filter((todo) => !todo.completed);
    },
    setEditingId: (state, action: PayloadAction<string | null>) => {
      state.editingId = action.payload;
    },
    loadTodos: (state, action: PayloadAction<ITodo[]>) => {
      state.todos = action.payload;
    },
  },
});

export const {
  addTodo,
  toggleTodo,
  removeTodo,
  editTodo,
  toggleAll,
  clearCompleted,
  setEditingId,
  loadTodos,
} = todoSlice.actions;

export default todoSlice.reducer;
