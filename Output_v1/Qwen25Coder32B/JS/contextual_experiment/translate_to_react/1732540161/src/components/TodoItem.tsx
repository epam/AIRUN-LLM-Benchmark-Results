import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleTodo, editTodo, deleteTodo } from '../store/todoSlice';
import useKeyPress from '../hooks/useKeyPress';

interface TodoItemProps {
    id: string;
    title: string;
    completed: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({ id, title, completed }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    const dispatch = useDispatch();
    const escPressed = useKeyPress('Escape');

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleBlur = () => {
        if (newTitle.trim()) {
            dispatch(editTodo({ id, title: newTitle }));
        } else {
            dispatch(deleteTodo(id));
        }
        setIsEditing(false);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleBlur();
        } else if (escPressed) {
            setNewTitle(title);
            setIsEditing(false);
        }
    };

    return (
        <li className={completed ? 'completed' : ''} style={{ display: isEditing ? 'block' : 'list-item' }}>
            {isEditing ? (
                <input
                    className=\"edit\"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
            ) : (
                <div className=\"view\">
                    <input
                        className=\"toggle\"
                        type=\"checkbox\"
                        checked={completed}
                        onChange={() => dispatch(toggleTodo(id))}
                    />
                    <label onDoubleClick={handleDoubleClick}>{title}</label>
                    <button className=\"destroy\" onClick={() => dispatch(deleteTodo(id))}></button>
                </div>
            )}
        </li>
    );
};

export default TodoItem;