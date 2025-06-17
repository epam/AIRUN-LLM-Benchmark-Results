import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useAppDispatch } from '../hooks';
import { addTodo } from '../slices/todosSlice';

const TodoForm: React.FC = () => {
    const dispatch = useAppDispatch();
    const [text, setText] = useState('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const trimmed = text.trim();
        if (!trimmed) {
            return;
        }
        dispatch(addTodo(trimmed));
        setText('');
    };

    return (
        <form className="todo-form" onSubmit={handleSubmit}>
            <input
                className="new-todo"
                placeholder="What needs to be done?"
                value={text}
                onChange={handleChange}
                autoFocus
            />
        </form>
    );
};

export default TodoForm;
