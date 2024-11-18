```typescript
import React, { useState, useEffect } from 'react';
import { useTodo } from '../hooks/useTodo';
import { useFocus } from '../../utils/focus';
import { useEscape } from '../../utils/escape';
import { Todo } from '../types';

export const TodoItem: React.FC<{ todo: Todo }> = ({ todo }) => {
    const { toggleTodo, removeTodo, editTodo } = useTodo();
    const [editing, setEditing] = useState(false);
    const [editText, setEditText] = useState(todo.title);
    const editField = useFocus<HTMLInputElement>(editing);

    useEscape(() => {
        if (editing) {
            setEditing(false);
            setEditText(todo.title);
        }
    });

    useEffect(() => {
        if (editing) {
            editField.current?.focus();
        }
    }, [editing, editField]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editText.trim()) {
            editTodo(todo.id, editText.trim());
            setEditing(false);
        } else {
            removeTodo(todo.id);
        }
    };

    return (
        <li className={`${todo.completed ? 'completed' : ''} ${editing ? 'editing' : ''}`}>
            <div className="view">
                <input
                    className="toggle"
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                />
                <label onDoubleClick={() => setEditing(true)}>{todo.title}</label>
                <button className="destroy" onClick={() => removeTodo(todo.id)}></button>
            </div>
            {editing && (
                <form onSubmit={handleSubmit}>
                    <input
                        ref={editField}
                        className="edit"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={handleSubmit}
                    />
                </form>
            )}
        </li>
    );
};
```