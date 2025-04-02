```typescript
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { Todo, TodoFilter } from '../types';
import { addTodo, toggleTodo, removeTodo, editTodo, clearCompleted, toggleAll } from '../store/todoSlice';

export function useTodo() {
    const dispatch = useDispatch<AppDispatch>();
    const todos = useSelector((state: RootState) => state.todos);

    const addNewTodo = (title: string) => dispatch(addTodo(title));
    const toggleTodoItem = (id: string) => dispatch(toggleTodo(id));
    const removeTodoItem = (id: string) => dispatch(removeTodo(id));
    const editTodoItem = (id: string, title: string) => dispatch(editTodo({ id, title }));
    const clearCompletedTodos = () => dispatch(clearCompleted());
    const toggleAllTodos = (completed: boolean) => dispatch(toggleAll(completed));

    const remainingCount = todos.filter(todo => !todo.completed).length;
    const doneCount = todos.length - remainingCount;
    const allChecked = remainingCount === 0;

    return {
        todos,
        addTodo: addNewTodo,
        toggleTodo: toggleTodoItem,
        removeTodo: removeTodoItem,
        editTodo: editTodoItem,
        clearCompleted: clearCompletedTodos,
        toggleAll: toggleAllTodos,
        remainingCount,
        doneCount,
        allChecked
    };
}
```