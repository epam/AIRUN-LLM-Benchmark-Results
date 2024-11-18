import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { Todo } from './types/todo';

const initialState: Todo[] = [];

const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        addTodo: {
            reducer(state, action: PayloadAction<Todo>) {
                state.push(action.payload);
            },
            prepare(title: string) {
                return { payload: { id: nanoid(), title, completed: false } };
            }
        },
        removeTodo(state, action: PayloadAction<string>) {
            return state.filter(todo => todo.id !== action.payload);
        },
        updateTodo(state, action: PayloadAction<Todo>) {
            const index = state.findIndex(todo => todo.id === action.payload.id);
            if (index !== -1) {
                state[index] = action.payload;
            }
        },
        clearCompleted(state) {
            return state.filter(todo => !todo.completed);
        },
        markAll(state, action: PayloadAction<boolean>) {
            state.forEach(todo => {
                todo.completed = action.payload;
            });
        }
    }
});

export const { addTodo, removeTodo, updateTodo, clearCompleted, markAll } = todosSlice.actions;

export const store = configureStore({
    reducer: {
        todos: todosSlice.reducer
    }
});