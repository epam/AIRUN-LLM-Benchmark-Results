import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../store';

const AddTodo: React.FC = () => {
    const [text, setText] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = text.trim();
        if (trimmed) {
            dispatch(addTodo(trimmed));
            setText('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="todo-form">
            <input
                className="new-todo"
                placeholder="What needs to be done?"
                value={text}
                onChange={(e) => setText(e.target.value)}
                autoFocus
            />
        </form>
    );
};

export default AddTodo;
