import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toggleTodo, removeTodo, updateTodo } from '../store/todosSlice';
import { Todo } from '../types';

interface TodoItemProps {
    todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
    const dispatch = useDispatch();
    const [editing, setEditing] = useState(false);
    const [editText, setEditText] = useState(todo.title);
    const editInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editing) {
            editInputRef.current?.focus();
        }
    }, [editing]);

    const handleToggle = () => {
        dispatch(toggleTodo(todo.id));
    };

    const handleDelete = () => {
        dispatch(removeTodo(todo.id));
    };

    const handleDoubleClick = () => {
        setEditing(true);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditText(e.target.value);
    };

    const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        const trimmedText = editText.trim();
        if (trimmedText) {
            dispatch(updateTodo({ id: todo.id, title: trimmedText }));
        } else {
            handleDelete();
        }
        setEditing(false);
    };

    const handleBlur = () => {
        handleSubmit();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            setEditText(todo.title);
            setEditing(false);
        } else if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    const liClasses = [
        todo.completed ? 'completed' : '',
        editing ? 'editing' : ''
    ].join(' ').trim();

    return (
        <li className={liClasses}>
            <div className="view">
                <input
                    className="toggle"
                    type="checkbox"
                    checked={todo.completed}
                    onChange={handleToggle}
                />
                <label onDoubleClick={handleDoubleClick}>{todo.title}</label>
                <button className="destroy" onClick={handleDelete}></button>
            </div>
            {editing && (
                <form onSubmit={handleSubmit}>
                    <input
                        ref={editInputRef}
                        className="edit"
                        value={editText}
                        onChange={handleEditChange}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                    />
                </form>
            )}
        </li>
    );
};

export default TodoItem;
