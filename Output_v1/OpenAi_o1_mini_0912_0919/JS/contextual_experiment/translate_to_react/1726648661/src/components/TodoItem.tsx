import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toggleTodo, removeTodo, editTodo } from '../slices/todoSlice';
import { Todo } from '../services/todoStorage';

interface TodoItemProps {
    todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(todo.title);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleToggle = () => {
        dispatch(toggleTodo(todo.id));
    };

    const handleRemove = () => {
        dispatch(removeTodo(todo.id));
    };

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleBlur = () => {
        if (isEditing) {
            submitEdit();
        }
    };

    const submitEdit = () => {
        const trimmedTitle = title.trim();
        if (trimmedTitle) {
            dispatch(editTodo({ id: todo.id, title: trimmedTitle }));
            setIsEditing(false);
        } else {
            dispatch(removeTodo(todo.id));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            setTitle(todo.title);
            setIsEditing(false);
        } else if (e.key === 'Enter') {
            submitEdit();
        }
    };

    return (
        <li className={`${todo.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`}>
            <div className="view">
                <input className="toggle" type="checkbox" checked={todo.completed} onChange={handleToggle} />
                <label onDoubleClick={handleDoubleClick}>{todo.title}</label>
                <button className="destroy" onClick={handleRemove}></button>
            </div>
            {isEditing && (
                <input
                    className="edit"
                    value={title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    ref={inputRef}
                />
            )}
        </li>
    );
};

export default TodoItem;