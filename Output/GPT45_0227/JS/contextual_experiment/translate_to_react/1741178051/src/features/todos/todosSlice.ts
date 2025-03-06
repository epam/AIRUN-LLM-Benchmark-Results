import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodosState {
  todos: Todo[];
}

const initialState: TodosState = {
  todos: JSON.parse(localStorage.getItem('todos-react-redux') || '[]'),
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer(state, action: PayloadAction<Todo>) {
        state.todos.push(action.payload);
      },
      prepare(title: string) {
        return { payload: { id: nanoid(), title, completed: false } };
      },
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
    removeTodo(state, action: PayloadAction<string>) {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    },
    editTodo(state, action: PayloadAction<{ id: string; title: string }>) {
      const todo = state.todos.find(todo => todo.id === action.payload.id);
      if (todo) todo.title = action.payload.title;
    },
    clearCompleted(state) {
      state.todos = state.todos.filter(todo => !todo.completed);
    },
    markAll(state, action: PayloadAction<boolean>) {
      state.todos.forEach(todo => (todo.completed = action.payload));
    },
  },
});

export const { addTodo, toggleTodo, removeTodo, editTodo, clearCompleted, markAll } = todosSlice.actions;

export const selectTodos = (state: { todos: TodosState }) => state.todos.todos;

export default todosSlice.reducer;