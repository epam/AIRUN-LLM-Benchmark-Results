import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../store/todoSlice';

const TodoForm: React.FC = () => {
    const [newTodo, setNewTodo] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const trimmedTitle = newTodo.trim();
        if (trimmedTitle) {
            dispatch(addTodo(trimmedTitle));
            setNewTodo('');
        }
    };

    return (
        <header className=\"header\">
            <h1>todos</h1>
            <form className=\"todo-form\" onSubmit={handleSubmit}>
                <input
                    className=\"new-todo\"
                    placeholder=\"What needs to be done?\"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    autoFocus
                />
            </form>
        </header>
    );
};

export default TodoForm;