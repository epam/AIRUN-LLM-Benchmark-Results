import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { removeTodo, updateTodo } from '../store';
import { Todo } from '../types/todo';

interface TodoItemProps {
    todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
    const [isEditing, setEditing] = useState(false);
    const [title, setTitle] = useState(todo.title);
    const dispatch = useDispatch();

    const handleEdit = () => {
        setEditing(true);
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(updateTodo({ ...todo, title }));
        setEditing(false);
    };

    return (
        <li className={todo.completed ? 'completed' : ''}>
            <div className="view">
                <input
                    className="toggle"
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => dispatch(updateTodo({ ...todo, completed: !todo.completed }))}
                />
                <label onDoubleClick={handleEdit}>{todo.title}</label>
                <button className="destroy" onClick={() => dispatch(removeTodo(todo.id))}></button>
            </div>
            {isEditing && (
                <form onSubmit={handleUpdate}>
                    <input
                        className="edit"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={handleUpdate}
                    />
                </form>
            )}
        </li>
    );
};

export default TodoItem;