import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../store';

const TodoForm: React.FC = () => {
    const [newTodo, setNewTodo] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTodo.trim()) return;
        dispatch(addTodo({ title: newTodo, completed: false }));
        setNewTodo('');
    };

    return (
        <form onSubmit={handleSubmit} className="todo-form">
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

export default TodoForm;