import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toggleTodo, removeTodo, updateTodo, Todo as TodoType } from '../store';

interface TodoItemProps {
    todo: TodoType;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(todo.title);
    const dispatch = useDispatch();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleDoubleClick = () => {
        setIsEditing(true);
        setEditText(todo.title);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            setIsEditing(false);
        } else if (e.key === 'Enter') {
            handleSave();
        }
    };

    const handleBlur = () => {
        handleSave();
    };

    const handleSave = () => {
        const trimmed = editText.trim();
        if (trimmed) {
            dispatch(updateTodo({ id: todo.id, title: trimmed }));
        } else {
            dispatch(removeTodo(todo.id));
        }
        setIsEditing(false);
    };

    const handleToggle = () => {
        dispatch(toggleTodo(todo.id));
    };

    const handleRemove = () => {
        dispatch(removeTodo(todo.id));
    };

    return (
        <li className={`${todo.completed ? 'completed' : ''}${isEditing ? ' editing' : ''}`}>
            <div className="view">
                <input
                    className="toggle"
                    type="checkbox"
                    checked={todo.completed}
                    onChange={handleToggle}
                />
                <label onDoubleClick={handleDoubleClick}>{todo.title}</label>
                <button className="destroy" onClick={handleRemove}></button>
            </div>
            {isEditing && (
                <input
                    ref={inputRef}
                    className="edit"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                />
            )}
        </li>
    );
};

export default TodoItem;
