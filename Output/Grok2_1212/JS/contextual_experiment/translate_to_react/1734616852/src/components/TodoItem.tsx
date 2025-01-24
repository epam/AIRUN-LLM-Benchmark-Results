```typescript
import React, { useState } from 'react';
import { useTodo } from '../hooks/useTodo';
import { useFocus } from '../utils/focus';
import { useEscape } from '../utils/escape';

type TodoItemProps = {
    todo: {
        id: string;
        title: string;
        completed: boolean;
    };
};

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
    const { toggleTodo, removeTodo, editTodo } = useTodo();
    const [editing, setEditing] = useState(false);
    const [editText, setEditText] = useState(todo.title);
    const editField = useFocus(editing);

    useEscape(() => {
        if (editing) {
            setEditText(todo.title);
            setEditing(false);
        }
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        editTodo(todo.id, editText.trim());
        setEditing(false);
    };

    const handleDoubleClick = () => {
        setEditText(todo.title);
        setEditing(true);
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
                <label onDoubleClick={handleDoubleClick}>{todo.title}</label>
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

export default TodoItem;
```