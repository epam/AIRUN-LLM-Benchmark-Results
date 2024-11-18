```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todo, getTodos, putTodos } from '../utils/todoStorage';
import { nanoid } from 'nanoid';

interface TodosState {
  todos: Todo[];
}

const initialState: TodosState = {
  todos: getTodos()
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer(state, action: PayloadAction<Todo>) {
        state.todos.push(action.payload);
        putTodos(state.todos);
      },
      prepare(title: string) {
        return { payload: { id: nanoid(), title, completed: false } };
      }
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        putTodos(state.todos);
      }
    },
    removeTodo(state, action: PayloadAction<string>) {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
      putTodos(state.todos);
    },
    editTodo(state, action: PayloadAction<{ id: string; title: string }>) {
      const todo = state.todos.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
        putTodos(state.todos);
      }
    },
    toggleAll(state, action: PayloadAction<boolean>) {
      state.todos.forEach(todo => {
        todo.completed = action.payload;
      });
      putTodos(state.todos);
    },
    clearCompleted(state) {
      state.todos = state.todos.filter(todo => !todo.completed);
      putTodos(state.todos);
    },
    setTodos(state, action: PayloadAction<Todo[]>) {
      state.todos = action.payload;
      putTodos(state.todos);
    }
  }
});

export const { addTodo, toggleTodo, removeTodo, editTodo, toggleAll, clearCompleted, setTodos } = todosSlice.actions;

export default todosSlice.reducer;
```