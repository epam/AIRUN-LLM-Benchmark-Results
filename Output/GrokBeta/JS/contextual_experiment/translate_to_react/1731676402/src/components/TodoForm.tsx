```typescript
import React, { useState } from 'react';
import { useTodo } from '../hooks/useTodo';

export const TodoForm: React.FC = () => {
    const { addTodo } = useTodo();
    const [newTodo, setNewTodo] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newTodo.trim()) {
            addTodo(newTodo.trim());
            setNewTodo('');
        }
    };

    return (
        <form className="todo-form" onSubmit={handleSubmit}>
            <input
                className="new-todo"
                placeholder="What needs to be done?"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                autoFocus
            />
        </form>
    );
};
```