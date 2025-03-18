import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

interface Todo {
    id: string;
    title: string;
    completed: boolean;
}

interface TodoState {
    todos: Todo[];
    statusFilter: string;
}

const initialState: TodoState = {
    todos: JSON.parse(localStorage.getItem('todos-react-redux') || '[]'),
    statusFilter: '',
};

const todoSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        addTodo: (state, action: PayloadAction<string>) => {
            const newTodo = {
                id: nanoid(),
                title: action.payload,
                completed: false,
            };
            state.todos.push(newTodo);
            localStorage.setItem('todos-react-redux', JSON.stringify(state.todos));
        },
        toggleTodo: (state, action: PayloadAction<string>) => {
            const todo = state.todos.find(todo => todo.id === action.payload);
            if (todo) {
                todo.completed = !todo.completed;
                localStorage.setItem('todos-react-redux', JSON.stringify(state.todos));
            }
        },
        editTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
            const todo = state.todos.find(todo => todo.id === action.payload.id);
            if (todo) {
                todo.title = action.payload.title;
                localStorage.setItem('todos-react-redux', JSON.stringify(state.todos));
            }
        },
        deleteTodo: (state, action: PayloadAction<string>) => {
            state.todos = state.todos.filter(todo => todo.id !== action.payload);
            localStorage.setItem('todos-react-redux', JSON.stringify(state.todos));
        },
        clearCompletedTodos: (state) => {
            state.todos = state.todos.filter(todo => !todo.completed);
            localStorage.setItem('todos-react-redux', JSON.stringify(state.todos));
        },
        setStatusFilter: (state, action: PayloadAction<string>) => {
            state.statusFilter = action.payload;
        },
    },
});

export const {
    addTodo,
    toggleTodo,
    editTodo,
    deleteTodo,
    clearCompletedTodos,
    setStatusFilter,
} = todoSlice.actions;

export const selectTodos = (state: { todos: TodoState }) => state.todos.todos;
export const selectRemainingCount = (state: { todos: TodoState }) =>
    state.todos.todos.filter(todo => !todo.completed).length;
export const selectStatusFilter = (state: { todos: TodoState }) => state.todos.statusFilter;

export default todoSlice.reducer;