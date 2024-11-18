```typescript
import React from 'react';
import { TodoForm } from './TodoForm';

export const TodoHeader: React.FC = () => {
    return (
        <header className="header">
            <h1>todos</h1>
            <TodoForm />
        </header>
    );
};
```