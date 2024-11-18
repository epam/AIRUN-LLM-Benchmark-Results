```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { Utils } from '../utils/utils';

interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodosState {
  todos: ITodo[];
}

const initialState: TodosState = {
  todos: Utils.store('react-todos'),
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer(state, action: PayloadAction<ITodo>) {
        state.todos.push(action.payload);
        Utils.store('react-todos', state.todos);
      },
      prepare(title: string) {
        return { payload: { id: nanoid(), title, completed: false } };
      },
    },
    toggleAll(state, action: PayloadAction<boolean>) {
      state.todos = state.todos.map((todo) => ({
        ...todo,
        completed: action.payload,
      }));
      Utils.store('react-todos', state.todos);
    },
    toggle(state, action: PayloadAction<string>) {
      const todo = state.todos.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        Utils.store('react-todos', state.todos);
      }
    },
    destroy(state, action: PayloadAction<string>) {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      Utils.store('react-todos', state.todos);
    },
    save(state, action: PayloadAction<{ id: string; title: string }>) {
      const { id, title } = action.payload;
      const todo = state.todos.find((todo) => todo.id === id);
      if (todo) {
        todo.title = title;
        Utils.store('react-todos', state.todos);
      }
    },
    clearCompleted(state) {
      state.todos = state.todos.filter((todo) => !todo.completed);
      Utils.store('react-todos', state.todos);
    },
  },
});

export const { addTodo, toggleAll, toggle, destroy, save, clearCompleted } = todosSlice.actions;
export default todosSlice.reducer;
```