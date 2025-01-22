```typescript
import React, { useState } from 'react';
import { useTodo } from '../hooks/useTodo';

const TodoForm: React.FC = () => {
    const { addTodo } = useTodo();
    const [newTodo, setNewTodo] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (newTodo.trim()) {
            addTodo(newTodo.trim());
            setNewTodo('');
        }
    };

    return (
        <header className="header">
            <h1>todos</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    className="new-todo" 
                    placeholder="What needs to be done?" 
                    value={newTodo} 
                    onChange={(e) => setNewTodo(e.target.value)} 
                    autoFocus 
                />
            </form>
        </header>
    );
};

export default TodoForm;
```