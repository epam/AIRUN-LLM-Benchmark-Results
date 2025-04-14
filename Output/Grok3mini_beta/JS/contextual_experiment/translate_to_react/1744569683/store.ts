import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

interface Todo {
    id: string;
    title: string;
    completed: boolean;
}

interface TodoState {
    todos: Todo[];
    filter: 'all' | 'active' | 'completed';
}

const initialState: TodoState = {
    todos: JSON.parse(localStorage.getItem('todos') || '[]'),
    filter: 'all'
};

const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        addTodo: (state, action: PayloadAction<string>) => {
            state.todos.push({ id: nanoid(), title: action.payload, completed: false });
        },
        toggleTodo: (state, action: PayloadAction<string>) => {
            const todo = state.todos.find(t => t.id === action.payload);
            if (todo) {
                todo.completed = !todo.completed;
            }
        },
        removeTodo: (state, action: PayloadAction<string>) => {
            state.todos = state.todos.filter(t => t.id !== action.payload);
        },
        updateTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
            const todo = state.todos.find(t => t.id === action.payload.id);
            if (todo) {
                todo.title = action.payload.title;
            }
        },
        setVisibilityFilter: (state, action: PayloadAction<'all' | 'active' | 'completed'>) => {
            state.filter = action.payload;
        },
        clearCompleted: (state) => {
            state.todos = state.todos.filter(t => !t.completed);
        },
        markAll: (state, action: PayloadAction<boolean>) => {
            state.todos.forEach(todo => {
                todo.completed = action.payload;
            });
        }
    }
});

export const { addTodo, toggleTodo, removeTodo, updateTodo, setVisibilityFilter, clearCompleted, markAll } = todoSlice.actions;

const store = configureStore({
    reducer: {
        todo: todoSlice.reducer
    }
});

store.subscribe(() => {
    localStorage.setItem('todos', JSON.stringify(store.getState().todo.todos));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
