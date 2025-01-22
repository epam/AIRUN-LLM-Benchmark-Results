```typescript
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import TodoItem from './TodoItem';

type TodoListProps = {
    filter: 'all' | 'active' | 'completed';
};

const TodoList: React.FC<TodoListProps> = ({ filter }) => {
    const todos = useSelector((state: RootState) => state.todos);

    const filteredTodos = todos.filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });

    return (
        <section className="main" style={{ display: todos.length ? 'block' : 'none' }}>
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

export default TodoList;
```