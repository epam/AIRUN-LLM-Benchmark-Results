import React, { useState, useRef } from 'react';
import { Todo } from '../types';
import { useDispatch } from 'react-redux';
import { toggleTodo, editTodo, deleteTodo } from '../slices/todosSlice';
import useTodoFocus from '../hooks/useTodoFocus';
import useTodoEscape from '../hooks/useTodoEscape';

interface TodoItemProps {
    todo: Todo;
    editing: boolean;
    onEdit: (id: string) => void;
    onCancelEdit: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, editing, onEdit, onCancelEdit }) => {
    const dispatch = useDispatch();
    const [editText, setEditText] = useState(todo.title);
    const editInputRef = useRef<HTMLInputElement>(null);

    useTodoFocus(editInputRef, editing);
    useTodoEscape(editInputRef, () => {
        setEditText(todo.title);
        onCancelEdit();
    });

    const handleToggle = () => {
        dispatch(toggleTodo(todo.id));
    };

    const handleDelete = () => {
        dispatch(deleteTodo(todo.id));
    };

    const handleEdit = () => {
        onEdit(todo.id);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditText(e.target.value);
    };

    const handleSubmit = () => {
        const trimmedText = editText.trim();
        if (trimmedText) {
            dispatch(editTodo({ id: todo.id, title: trimmedText }));
            onCancelEdit();
        } else {
            handleDelete();
        }
    };

    const handleBlur = () => {
        if (editing) {
            handleSubmit();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <li className={"${todo.completed ? 'completed' : ''} ${editing ? 'editing' : ''}"}>
            {!editing ? (
                <div className="view">
                    <input className="toggle" type="checkbox" checked={todo.completed} onChange={handleToggle} />
                    <label onDoubleClick={handleEdit}>{todo.title}</label>
                    <button className="destroy" onClick={handleDelete}></button>
                </div>
            ) : (
                <input
                    className="edit"
                    value={editText}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    ref={editInputRef}
                />
            )}
        </li>
    );
};

export default TodoItem;