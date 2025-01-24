```typescript
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { addTodo, toggleTodo, removeTodo, editTodo, clearCompleted, toggleAll } from '../store/todoSlice';

export function useTodo() {
    const dispatch = useDispatch<AppDispatch>();
    const todos = useSelector((state: RootState) => state.todos);

    const remainingCount = todos.filter(todo => !todo.completed).length;
    const doneCount = todos.length - remainingCount;

    return {
        todos,
        remainingCount,
        doneCount,
        addTodo: (title: string) => dispatch(addTodo(title)),
        toggleTodo: (id: string) => dispatch(toggleTodo(id)),
        removeTodo: (id: string) => dispatch(removeTodo(id)),
        editTodo: (id: string, title: string) => dispatch(editTodo({ id, title })),
        clearCompleted: () => dispatch(clearCompleted()),
        toggleAll: (completed: boolean) => dispatch(toggleAll(completed))
    };
}
```