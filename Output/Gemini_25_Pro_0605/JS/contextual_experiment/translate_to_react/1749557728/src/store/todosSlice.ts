import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { Todo, Filter } from '../types';

const STORAGE_ID = 'todos-react-toolkit';

const getInitialTodos = (): Todo[] => {
    try {
        const storedTodos = localStorage.getItem(STORAGE_ID);
        return storedTodos ? JSON.parse(storedTodos) : [];
    } catch (error) {
        console.error("Failed to parse todos from localStorage", error);
        return [];
    }
};

const saveTodos = (todos: Todo[]) => {
    localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
};

interface TodosState {
    todos: Todo[];
    filter: Filter;
}

const initialState: TodosState = {
    todos: getInitialTodos(),
    filter: 'all',
};

const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        addTodo: {
            reducer: (state, action: PayloadAction<Todo>) => {
                state.todos.push(action.payload);
                saveTodos(state.todos);
            },
            prepare: (title: string) => ({
                payload: {
                    id: nanoid(),
                    title,
                    completed: false,
                },
            }),
        },
        toggleTodo(state, action: PayloadAction<string>) {
            const todo = state.todos.find(todo => todo.id === action.payload);
            if (todo) {
                todo.completed = !todo.completed;
                saveTodos(state.todos);
            }
        },
        removeTodo(state, action: PayloadAction<string>) {
            state.todos = state.todos.filter(todo => todo.id !== action.payload);
            saveTodos(state.todos);
        },
        updateTodo(state, action: PayloadAction<{ id: string; title: string }>) {
            const todo = state.todos.find(todo => todo.id === action.payload.id);
            if (todo) {
                todo.title = action.payload.title;
                saveTodos(state.todos);
            }
        },
        clearCompleted(state) {
            state.todos = state.todos.filter(todo => !todo.completed);
            saveTodos(state.todos);
        },
        toggleAll(state, action: PayloadAction<boolean>) {
            state.todos.forEach(todo => {
                todo.completed = action.payload;
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
    removeTodo,
    updateTodo,
    clearCompleted,
    toggleAll,
    setFilter,
} = todosSlice.actions;

export default todosSlice.reducer;
