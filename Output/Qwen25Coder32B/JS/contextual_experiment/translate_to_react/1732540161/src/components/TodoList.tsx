import React from 'react';
import { useSelector } from 'react-redux';
import { selectTodos, selectStatusFilter } from '../store/todoSlice';
import TodoItem from './TodoItem';

const TodoList: React.FC = () => {
    const todos = useSelector(selectTodos);
    const statusFilter = useSelector(selectStatusFilter);

    const filteredTodos = todos.filter(todo => {
        if (statusFilter === 'active') {
            return !todo.completed;
        } else if (statusFilter === 'completed') {
            return todo.completed;
        }
        return true;
    });

    return (
        <section className=\"main\" style={{ display: todos.length > 0 ? 'block' : 'none' }}>
            <input
                id=\"toggle-all\"
                className=\"toggle-all\"
                type=\"checkbox\"
                checked={todos.every(todo => todo.completed)}
                onChange={() => {
                    const allCompleted = todos.every(todo => todo.completed);
                    todos.forEach(todo => {
                        if (todo.completed !== allCompleted) {
                            // Dispatch action to toggle each todo
                        }
                    });
                }}
            />
            <label htmlFor=\"toggle-all\">Mark all as complete</label>
            <ul className=\"todo-list\">
                {filteredTodos.map(todo => (
                    <TodoItem
                        key={todo.id}
                        id={todo.id}
                        title={todo.title}
                        completed={todo.completed}
                    />
                ))}
            </ul>
        </section>
    );
};

export default TodoList;