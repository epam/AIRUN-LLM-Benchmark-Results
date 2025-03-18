import { createSlice, PayloadAction, configureStore, combineReducers } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

const STORAGE_KEY = 'react-todos';

const loadInitialState = () => {
    const storedTodos = localStorage.getItem(STORAGE_KEY);
    return storedTodos ? JSON.parse(storedTodos) : [];
}

const saveState = (state: Todo[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const todoSlice = createSlice({
  name: 'todos',
  initialState: loadInitialState() as Todo[],
  reducers: {
    addTodo: {
      reducer: (state, action: PayloadAction<{ id: string; title: string }>) => {
        state.push({ id: action.payload.id, title: action.payload.title, completed: false });
        saveState(state);
      },
      prepare: (title: string) => ({
        payload: { id: nanoid(), title },
      }),
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
      saveState(state);
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      const newState = state.filter((todo) => todo.id !== action.payload);
      saveState(newState);
      return newState
    },
    editTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
      }
      saveState(state);
    },
    toggleAll: (state, action: PayloadAction<boolean>) => {
      state.forEach(todo => {
          todo.completed = action.payload
      });
      saveState(state);
    },
    clearCompleted: (state) => {
        const newState = state.filter((todo) => !todo.completed);
        saveState(newState);
        return newState
    },
  },
});

export const {
  addTodo,
  toggleTodo,
  deleteTodo,
  editTodo,
  toggleAll,
  clearCompleted
} = todoSlice.actions;

const rootReducer = combineReducers({
    todos: todoSlice.reducer
})

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
