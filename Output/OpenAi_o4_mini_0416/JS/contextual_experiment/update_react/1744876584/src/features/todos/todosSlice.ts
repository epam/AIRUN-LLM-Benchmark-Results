import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { ITodo } from '../../types';
import { ALL_TODOS } from '../../constants';

interface TodosState {
  items: ITodo[];
  filter: string;
}

const initialState: TodosState = {
  items: [],
  filter: ALL_TODOS,
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer(state, action: PayloadAction<ITodo>) {
        state.items.push(action.payload);
      },
      prepare(title: string) {
        return { payload: { id: nanoid(), title, completed: false } };
      }
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const todo = state.items.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    removeTodo(state, action: PayloadAction<string>) {
      state.items = state.items.filter(todo => todo.id !== action.payload);
    },
    editTodo(state, action: PayloadAction<{ id: string; text: string }>) {
      const todo = state.items.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.text;
      }
    },
    toggleAll(state, action: PayloadAction<boolean>) {
      state.items.forEach(todo => {
        todo.completed = action.payload;
      });
    },
    clearCompleted(state) {
      state.items = state.items.filter(todo => !todo.completed);
    },
    setFilter(state, action: PayloadAction<string>) {
      state.filter = action.payload;
    }
  }
});

export const { addTodo, toggleTodo, removeTodo, editTodo, toggleAll, clearCompleted, setFilter } = todosSlice.actions;
export default todosSlice.reducer;
