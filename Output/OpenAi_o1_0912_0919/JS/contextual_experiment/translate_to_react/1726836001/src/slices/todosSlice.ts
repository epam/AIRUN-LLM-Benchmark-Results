import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todo } from '../types';
import { nanoid } from 'nanoid';

const initialState: Todo[] = JSON.parse(localStorage.getItem('todos-react-app') || '[]');

const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        addTodo: {
            reducer(state, action: PayloadAction<Todo>) {
                state.push(action.payload);
                localStorage.setItem('todos-react-app', JSON.stringify(state));
            },
            prepare(title: string) {
                return {
                    payload: {
                        id: nanoid(),
                        title: title.trim(),
                        completed: false,
                    },
                };
            },
        },
        toggleTodo(state, action: PayloadAction<string>) {
            const todo = state.find(todo => todo.id === action.payload);
            if (todo) {
                todo.completed = !todo.completed;
                localStorage.setItem('todos-react-app', JSON.stringify(state));
            }
        },
        editTodo(state, action: PayloadAction<{ id: string; title: string }>) {
            const todo = state.find(todo => todo.id === action.payload.id);
            if (todo) {
                todo.title = action.payload.title.trim();
                localStorage.setItem('todos-react-app', JSON.stringify(state));
            }
        },
        deleteTodo(state, action: PayloadAction<string>) {
            const index = state.findIndex(todo => todo.id === action.payload);
            if (index !== -1) {
                state.splice(index, 1);
                localStorage.setItem('todos-react-app', JSON.stringify(state));
            }
        },
        clearCompleted(state) {
            const activeTodos = state.filter(todo => !todo.completed);
            localStorage.setItem('todos-react-app', JSON.stringify(activeTodos));
            return activeTodos;
        },
        toggleAll(state) {
            const allCompleted = state.every(todo => todo.completed);
            state.forEach(todo => {
                todo.completed = !allCompleted;
            });
            localStorage.setItem('todos-react-app', JSON.stringify(state));
        },
    },
});

export const { addTodo, toggleTodo, editTodo, deleteTodo, clearCompleted, toggleAll } = todosSlice.actions;
export default todosSlice.reducer;