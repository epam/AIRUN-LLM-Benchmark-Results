```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ITodo, IAppState } from '../types';
import { uuid, store } from '../utils/utils';
import { ALL_TODOS } from '../constants';

export interface TodosState {
  todos: ITodo[];
  visibilityFilter: string;
}

const initialState: TodosState = {
  todos: store('react-todos') || [],
  visibilityFilter: ALL_TODOS
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.todos.push({
        id: uuid(),
        title: action.payload,
        completed: false
      });
      store('react-todos', state.todos);
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        store('react-todos', state.todos);
      }
    },
    toggleAll: (state, action: PayloadAction<boolean>) => {
      state.todos = state.todos.map(todo => ({ ...todo, completed: action.payload }));
      store('react-todos', state.todos);
    },
    destroyTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
      store('react-todos', state.todos);
    },
    editTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.todos.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
        store('react-todos', state.todos);
      }
    },
    clearCompleted: (state) => {
      state.todos = state.todos.filter(todo => !todo.completed);
      store('react-todos', state.todos);
    },
    setVisibilityFilter: (state, action: PayloadAction<string>) => {
      state.visibilityFilter = action.payload;
    }
  }
});

export const { 
  addTodo, 
  toggleTodo, 
  toggleAll, 
  destroyTodo, 
  editTodo, 
  clearCompleted, 
  setVisibilityFilter 
} = todosSlice.actions;

export default todosSlice.reducer;
```