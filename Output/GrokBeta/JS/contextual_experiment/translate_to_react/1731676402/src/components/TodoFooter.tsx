```typescript
import React from 'react';
import { useTodo } from '../hooks/useTodo';
import { TodoFilter } from '../types';

export const TodoFooter: React.FC<{ filter: TodoFilter; setFilter: (filter: TodoFilter) => void }> = ({ filter, setFilter }) => {
    const { remainingCount, doneCount, clearCompleted } = useTodo();

    return (
        <footer className="footer" style={{ display: remainingCount + doneCount > 0 ? 'block' : 'none' }}>
            <span className="todo-count">
                <strong>{remainingCount}</strong> {remainingCount === 1 ? 'item left' : 'items left'}
            </span>
            <ul className="filters">
                <li>
                    <a href="#" onClick={() => setFilter('all')} className={filter === 'all' ? 'selected' : ''}>All</a>
                </li>
                <li>
                    <a href="#" onClick={() => setFilter('active')} className={filter === 'active' ? 'selected' : ''}>Active</a>
                </li>
                <li>
                    <a href="#" onClick={() => setFilter('completed')} className={filter === 'completed' ? 'selected' : ''}>Completed</a>
                </li>
            </ul>
            {doneCount > 0 && (
                <button className="clear-completed" onClick={clearCompleted}>Clear completed</button>
            )}
        </footer>
    );
};
```