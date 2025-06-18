import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { loadTodos, saveTodos } from '../utils/localStorage';
import type { RootState } from '../store';

export interface Todo {
    id: string;
    title: string;
    completed: boolean;
}

export type Filter = 'all' | 'active' | 'completed';

interface TodosState {
    todos: Todo[];
    filter: Filter;
}

const initialState: TodosState = {
    todos: loadTodos<Todo[]>(),
    filter: 'all',
};

const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        addTodo: {
            prepare(title: string) {
                return { payload: { id: nanoid(), title: title.trim(), completed: false } };
            },
            reducer(state, action: PayloadAction<Todo>) {
                state.todos.push(action.payload);
                saveTodos(state.todos);
            },
        },
        toggleTodo(state, action: PayloadAction<string>) {
            const todo = state.todos.find(t => t.id === action.payload);
            if (todo) {
                todo.completed = !todo.completed;
                saveTodos(state.todos);
            }
        },
        updateTodo(state, action: PayloadAction<{ id: string; title: string }>) {
            const todo = state.todos.find(t => t.id === action.payload.id);
            if (todo) {
                todo.title = action.payload.title.trim();
                saveTodos(state.todos);
            }
        },
        removeTodo(state, action: PayloadAction<string>) {
            state.todos = state.todos.filter(t => t.id !== action.payload);
            saveTodos(state.todos);
        },
        clearCompleted(state) {
            state.todos = state.todos.filter(t => !t.completed);
            saveTodos(state.todos);
        },
        toggleAll(state, action: PayloadAction<boolean>) {
            state.todos.forEach(t => {
                t.completed = action.payload;
            });
            saveTodos(state.todos);
        },
        setFilter(state, action: PayloadAction<Filter>) {
            state.filter = action.payload;
        },
    },
});

export const {
    addTodo,
    toggleTodo,
    updateTodo,
    removeTodo,
    clearCompleted,
    toggleAll,
    setFilter,
} = todosSlice.actions;

export const selectTodos = (state: RootState) => state.todos.todos;
export const selectFilter = (state: RootState) => state.todos.filter;

export default todosSlice.reducer;
