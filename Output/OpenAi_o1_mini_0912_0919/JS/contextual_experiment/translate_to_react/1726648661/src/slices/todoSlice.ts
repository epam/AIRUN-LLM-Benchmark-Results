import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { loadTodos, saveTodos, Todo } from '../services/todoStorage';

const initialState: Todo[] = loadTodos();

const todoSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        addTodo: {
            reducer(state, action: PayloadAction<Todo>) {
                state.push(action.payload);
                saveTodos(state);
            },
            prepare(title: string) {
                return { payload: { id: nanoid(), title, completed: false } };
            },
        },
        toggleTodo(state, action: PayloadAction<string>) {
            const todo = state.find(todo => todo.id === action.payload);
            if (todo) {
                todo.completed = !todo.completed;
                saveTodos(state);
            }
        },
        removeTodo(state, action: PayloadAction<string>) {
            const index = state.findIndex(todo => todo.id === action.payload);
            if (index !== -1) {
                state.splice(index, 1);
                saveTodos(state);
            }
        },
        editTodo(state, action: PayloadAction<{ id: string; title: string }>) {
            const todo = state.find(todo => todo.id === action.payload.id);
            if (todo) {
                todo.title = action.payload.title;
                saveTodos(state);
            }
        },
        clearCompleted(state) {
            const newState = state.filter(todo => !todo.completed);
            state.splice(0, state.length, ...newState);
            saveTodos(state);
        },
        markAll(state, action: PayloadAction<boolean>) {
            state.forEach(todo => {
                todo.completed = action.payload;
            });
            saveTodos(state);
        },
    },
});

export const { addTodo, toggleTodo, removeTodo, editTodo, clearCompleted, markAll } = todoSlice.actions;

export default todoSlice.reducer;