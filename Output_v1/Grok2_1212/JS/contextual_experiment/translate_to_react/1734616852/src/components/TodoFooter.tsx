```typescript
import React from 'react';
import { useTodo } from '../hooks/useTodo';

const TodoFooter: React.FC = () => {
    const { todos, remainingCount, clearCompleted } = useTodo();

    return (
        <footer className="footer" style={{ display: todos.length ? 'block' : 'none' }}>
            <span className="todo-count">
                <strong>{remainingCount}</strong> item{remainingCount === 1 ? '' : 's'} left
            </span>
            <ul className="filters">
                <li>
                    <a href="#/">All</a>
                </li>
                <li>
                    <a href="#/active">Active</a>
                </li>
                <li>
                    <a href="#/completed">Completed</a>
                </li>
            </ul>
            <button 
                className="clear-completed" 
                onClick={clearCompleted} 
                style={{ display: remainingCount < todos.length ? 'block' : 'none' }}
            >
                Clear completed
            </button>
        </footer>
    );
};

export default TodoFooter;
```