import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodosState {
  todos: Todo[];
  statusFilter: 'all' | 'active' | 'completed';
}

const initialState: TodosState = {
  todos: [],
  statusFilter: 'all',
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setTodos(state, action: PayloadAction<Todo[]>) {
      state.todos = action.payload;
    },
    addTodo(state, action: PayloadAction<string>) {
      const newTodo: Todo = {
        id: nanoid(),
        title: action.payload,
        completed: false,
      };
      state.todos.push(newTodo);
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const todo = state.todos.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    removeTodo(state, action: PayloadAction<string>) {
      state.todos = state.todos.filter(t => t.id !== action.payload);
    },
    updateTodo(state, action: PayloadAction<{ id: string; title: string }>) {
      const { id, title } = action.payload;
      const todo = state.todos.find(t => t.id === id);
      if (todo) {
        todo.title = title;
      }
    },
    setFilter(state, action: PayloadAction<'all' | 'active' | 'completed'>) {
      state.statusFilter = action.payload;
    },
    clearCompleted(state) {
      state.todos = state.todos.filter(t => !t.completed);
    },
    toggleAll(state, action: PayloadAction<boolean>) {
      state.todos.forEach(t => {
        t.completed = action.payload;
      });
    },
  },
});

export const {
  setTodos,
  addTodo,
  toggleTodo,
  removeTodo,
  updateTodo,
  setFilter,
  clearCompleted,
  toggleAll,
} = todosSlice.actions;

export default todosSlice.reducer;
