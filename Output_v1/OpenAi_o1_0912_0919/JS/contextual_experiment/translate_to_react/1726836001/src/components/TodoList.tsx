import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import TodoItem from './TodoItem';
import { useLocation } from 'react-router-dom';

const TodoList: React.FC = () => {
    const todos = useSelector((state: RootState) => state.todos);
    const [editingId, setEditingId] = useState<string | null>(null);
    const location = useLocation();

    let filteredTodos = todos;
    if (location.pathname === '/active') {
        filteredTodos = todos.filter(todo => !todo.completed);
    } else if (location.pathname === '/completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    }

    const handleEdit = (id: string) => {
        setEditingId(id);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
    };

    return (
        <ul className="todo-list">
            {filteredTodos.map((todo) => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    editing={editingId === todo.id}
                    onEdit={handleEdit}
                    onCancelEdit={handleCancelEdit}
                />
            ))}
        </ul>
    );
};

export default TodoList;
