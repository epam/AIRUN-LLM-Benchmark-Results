import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { Utils } from '../../utils';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodosState {
  todos: Todo[];
}

const initialState: TodosState = {
  todos: Utils.store('react-todos') || [],
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer(state, action: PayloadAction<Todo>) {
        state.todos.push(action.payload);
        Utils.store('react-todos', state.todos);
      },
      prepare(title: string) {
        return {
          payload: {
            id: nanoid(),
            title,
            completed: false,
          },
        };
      },
    },
    toggleAll(state, action: PayloadAction<boolean>) {
      state.todos = state.todos.map(todo => ({ ...todo, completed: action.payload }));
      Utils.store('react-todos', state.todos);
    },
    toggleTodo(state, action: PayloadAction<string>) {
      state.todos = state.todos.map(todo =>
        todo.id !== action.payload ? todo : { ...todo, completed: !todo.completed }
      );
      Utils.store('react-todos', state.todos);
    },
    destroyTodo(state, action: PayloadAction<string>) {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
      Utils.store('react-todos', state.todos);
    },
    saveTodo(state, action: PayloadAction<{ id: string; title: string }>) {
      state.todos = state.todos.map(todo =>
        todo.id !== action.payload.id ? todo : { ...todo, title: action.payload.title }
      );
      Utils.store('react-todos', state.todos);
    },
    clearCompleted(state) {
      state.todos = state.todos.filter(todo => !todo.completed);
      Utils.store('react-todos', state.todos);
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
