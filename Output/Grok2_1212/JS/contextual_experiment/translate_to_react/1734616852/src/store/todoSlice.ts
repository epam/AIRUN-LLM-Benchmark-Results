```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

export interface Todo {
    id: string;
    title: string;
    completed: boolean;
}

const todoSlice = createSlice({
    name: 'todos',
    initialState: [] as Todo[],
    reducers: {
        addTodo: {
            reducer: (state, action: PayloadAction<Todo>) => {
                state.push(action.payload);
            },
            prepare: (title: string) => ({
                payload: {
                    id: nanoid(),
                    title,
                    completed: false
                }
            })
        },
        toggleTodo: (state, action: PayloadAction<string>) => {
            const todo = state.find(todo => todo.id === action.payload);
            if (todo) {
                todo.completed = !todo.completed;
            }
        },
        removeTodo: (state, action: PayloadAction<string>) => {
            return state.filter(todo => todo.id !== action.payload);
        },
        editTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
            const todo = state.find(todo => todo.id === action.payload.id);
            if (todo) {
                todo.title = action.payload.title;
            }
        },
        clearCompleted: (state) => {
            return state.filter(todo => !todo.completed);
        },
        toggleAll: (state, action: PayloadAction<boolean>) => {
            state.forEach(todo => {
                todo.completed = action.payload;
            });
        }
    }
});

export const { addTodo, toggleTodo, removeTodo, editTodo, clearCompleted, toggleAll } = todoSlice.actions;
export default todoSlice.reducer;
```