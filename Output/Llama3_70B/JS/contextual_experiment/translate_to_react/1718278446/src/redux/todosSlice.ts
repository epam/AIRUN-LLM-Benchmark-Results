import { createSlice, nanoid } from '@reduxjs/toolkit';

const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    addTodo: (state, action) => {
      state.push({ id: nanoid(), title: action.payload, completed: false });
    },
    removeTodo: (state, action) => {
      return state.filter((todo) => todo.id !== action.payload);
    },
    editTodo: (state, action) => {
      return state.map((todo) => (todo.id === action.payload.id ? { ...todo, title: action.payload.title } : todo));
    },
    toggleTodo: (state, action) => {
      return state.map((todo) => (todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo));
    },
  },
});

export const { addTodo, removeTodo, editTodo, toggleTodo } = todosSlice.actions;
export default todosSlice.reducer;
