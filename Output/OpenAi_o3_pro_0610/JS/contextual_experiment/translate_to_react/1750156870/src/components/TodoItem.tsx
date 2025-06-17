import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch } from '../hooks';
import { toggleTodo, updateTodo, removeTodo, Todo } from '../slices/todosSlice';

interface Props {
    todo: Todo;
}

const TodoItem: React.FC<Props> = ({ todo }) => {
    const dispatch = useAppDispatch();
    const [editing, setEditing] = useState(false);
    const [text, setText] = useState(todo.title);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editing) {
            inputRef.current?.focus();
        }
    }, [editing]);

    const handleToggle = () => {
        dispatch(toggleTodo(todo.id));
    };

    const handleDestroy = () => {
        dispatch(removeTodo(todo.id));
    };

    const handleSubmit = () => {
        const trimmed = text.trim();
        if (!trimmed) {
            dispatch(removeTodo(todo.id));
        } else {
            dispatch(updateTodo({ id: todo.id, title: trimmed }));
        }
        setEditing(false);
    };

    const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = e => {
        if (e.key === 'Enter') {
            handleSubmit();
        } else if (e.key === 'Escape') {
            setEditing(false);
            setText(todo.title);
        }
    };

    const handleDoubleClick = () => {
        setEditing(true);
        setText(todo.title);
    };

    return (
        <li className={`${todo.completed ? 'completed' : ''} ${editing ? 'editing' : ''}`.trim()}>
            <div className="view">
                <input className="toggle" type="checkbox" checked={todo.completed} onChange={handleToggle} />
                <label onDoubleClick={handleDoubleClick}>{todo.title}</label>
                <button className="destroy" onClick={handleDestroy}></button>
            </div>
            {editing && (
                <input
                    ref={inputRef}
                    className="edit"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onBlur={handleSubmit}
                    onKeyDown={handleKeyDown}
                />
            )}
        </li>
    );
};

export default TodoItem;
