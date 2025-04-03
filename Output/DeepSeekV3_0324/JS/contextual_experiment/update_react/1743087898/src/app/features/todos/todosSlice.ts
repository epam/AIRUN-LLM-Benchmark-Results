import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { store } from '../../utils';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodosState {
  todos: Todo[];
}

const initialState: TodosState = {
  todos: store('react-todos')
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.todos.push({
        id: nanoid(),
        title: action.payload,
        completed: false
      });
      store('react-todos', state.todos);
    },
    toggleAll: (state, action: PayloadAction<boolean>) => {
      state.todos = state.todos.map(todo => ({
        ...todo,
        completed: action.payload
      }));
      store('react-todos', state.todos);
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
      store('react-todos', state.todos);
    },
    destroyTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
      store('react-todos', state.todos);
    },
    saveTodo: (state, action: PayloadAction<{id: string, text: string}>) => {
      const todo = state.todos.find(t => t.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.text;
      }
      store('react-todos', state.todos);
    },
    clearCompleted: (state) => {
      state.todos = state.todos.filter(todo => !todo.completed);
      store('react-todos', state.todos);
    }
  }
});

export const { 
  addTodo, 
  toggleAll, 
  toggleTodo, 
  destroyTodo, 
  saveTodo, 
  clearCompleted 
} = todosSlice.actions;

export default todosSlice.reducer;