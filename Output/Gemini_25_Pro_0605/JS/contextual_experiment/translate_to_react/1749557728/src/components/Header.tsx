import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../store/todosSlice';

const Header: React.FC = () => {
    const [newTodo, setNewTodo] = useState('');
    const dispatch = useDispatch();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTodo(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmedTodo = newTodo.trim();
        if (trimmedTodo) {
            dispatch(addTodo(trimmedTodo));
            setNewTodo('');
        }
    };

    return (
        <header className="header">
            <h1>todos</h1>
            <form className="todo-form" onSubmit={handleSubmit}>
                <input
                    className="new-todo"
                    placeholder="What needs to be done?"
                    value={newTodo}
                    onChange={handleChange}
                    autoFocus
                />
            </form>
        </header>
    );
};

export default Header;
