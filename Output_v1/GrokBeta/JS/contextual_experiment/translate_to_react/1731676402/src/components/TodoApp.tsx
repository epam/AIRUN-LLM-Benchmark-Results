```typescript
import React, { useState } from 'react';
import { TodoHeader } from './TodoHeader';
import { TodoList } from './TodoList';
import { TodoFooter } from './TodoFooter';
import { TodoFilter } from '../types';

export const TodoApp: React.FC = () => {
    const [filter, setFilter] = useState<TodoFilter>('all');

    return (
        <section className="todoapp">
            <TodoHeader />
            <TodoList filter={filter} />
            <TodoFooter filter={filter} setFilter={setFilter} />
        </section>
    );
};
```