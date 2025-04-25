import { createSlice } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

const STORAGE_ID = 'todos-react-redux';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

const loadTodos = (): Todo[] => {
  const stored = localStorage.getItem(STORAGE_ID);
  return stored ? JSON.parse(stored) : [];
};

const saveTodos = (todos: Todo[]) => {
  localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
};

const initialState: Todo[] = loadTodos();

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer: (state, action) => {
        state.push(action.payload);
        saveTodos(state);
      },
      prepare: (title: string) => ({
        payload: { id: nanoid(), title, completed: false },
      }),
    },
    toggleTodo: (state, action) => {
      const todo = state.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        saveTodos(state);
      }
    },
    removeTodo: (state, action) => {
      const index = state.findIndex(t => t.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
        saveTodos(state);
      }
    },
    updateTodo: (state, action) => {
      const { id, title } = action.payload;
      const todo = state.find(t => t.id === id);
      if (todo) {
        todo.title = title;
        saveTodos(state);
      }
    },
    clearCompleted: (state) => {
      const filtered = state.filter(t => !t.completed);
      saveTodos(filtered);
      return filtered;
    },
    toggleAll: (state, action) => {
      const done = action.payload;
      state.forEach(t => {
        t.completed = done;
      });
      saveTodos(state);
    },
  },
});

export const { addTodo, toggleTodo, removeTodo, updateTodo, clearCompleted, toggleAll } = todoSlice.actions;
export default todoSlice.reducer;
