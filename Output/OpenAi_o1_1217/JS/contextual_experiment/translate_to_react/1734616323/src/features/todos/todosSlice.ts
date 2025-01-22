```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { RootState } from '../../store';
import { Todo } from '../../types/Todo';

interface TodosState {
  items: Todo[];
  filter: 'all' | 'active' | 'completed';
}

const initialState: TodosState = {
  items: [],
  filter: 'all'
};

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer: (state, action: PayloadAction<Todo>) => {
        state.items.push(action.payload);
      },
      prepare: (payload: { title: string }) => {
        return {
          payload: {
            id: nanoid(),
            title: payload.title,
            completed: false
          }
        };
      }
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((todo) => todo.id !== action.payload);
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.items.find((t) => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    updateTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.items.find((t) => t.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
      }
    },
    clearCompleted: (state) => {
      state.items = state.items.filter((todo) => !todo.completed);
    },
    toggleAll: (state, action: PayloadAction<boolean>) => {
      state.items.forEach((todo) => {
        todo.completed = action.payload;
      });
    },
    setFilter: (state, action: PayloadAction<'all' | 'active' | 'completed'>) => {
      state.filter = action.payload;
    }
  }
});

export const {
  addTodo,
  removeTodo,
  toggleTodo,
  updateTodo,
  clearCompleted,
  toggleAll,
  setFilter
} = todosSlice.actions;

export const selectTodos = (state: RootState) => state.todos.items;
export const selectFilter = (state: RootState) => state.todos.filter;
export const selectFilteredTodos = (state: RootState) => {
  const { items, filter } = state.todos;
  if (filter === 'active') {
    return items.filter((todo) => !todo.completed);
  }
  if (filter === 'completed') {
    return items.filter((todo) => todo.completed);
  }
  return items;
};
export const selectActiveCount = (state: RootState) => {
  return state.todos.items.filter((todo) => !todo.completed).length;
};
export const selectCompletedCount = (state: RootState) => {
  return state.todos.items.filter((todo) => todo.completed).length;
};
export const selectAllCompleted = (state: RootState) => {
  const { items } = state.todos;
  return items.length > 0 && items.every((todo) => todo.completed);
};

export default todosSlice.reducer;
```