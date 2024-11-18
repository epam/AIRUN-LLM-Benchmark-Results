import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../slices/todoSlice';
import { AppDispatch } from '../store';

const NewTodo: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [title, setTitle] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedTitle = title.trim();
        if (trimmedTitle) {
            dispatch(addTodo(trimmedTitle));
            setTitle('');
        }
    };

    return (
        <form className="todo-form" onSubmit={handleSubmit}>
            <input
                className="new-todo"
                placeholder="What needs to be done?"
                value={title}
                onChange={handleChange}
                autoFocus
            />
        </form>
    );
};

export default NewTodo;