```typescript
import React from 'react';
import { TodoItem } from './TodoItem';
import { useTodo } from '../hooks/useTodo';
import { TodoFilter } from '../types';

export const TodoList: React.FC<{ filter: TodoFilter }> = ({ filter }) => {
    const { todos } = useTodo();

    const filteredTodos = todos.filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });

    return (
        <section className="main" style={{ display: todos.length > 0 ? 'block' : 'none' }}>
            <input id="toggle-all" className="toggle-all" type="checkbox" />
            <label htmlFor="toggle-all">Mark all as complete</label>
            <ul className="todo-list">
                {filteredTodos.map(todo => (
                    <TodoItem key={todo.id} todo={todo} />
                ))}
            </ul>
        </section>
    );
};
```