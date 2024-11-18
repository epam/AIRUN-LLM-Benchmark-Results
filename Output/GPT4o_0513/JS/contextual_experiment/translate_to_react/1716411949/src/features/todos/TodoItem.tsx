import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { toggleTodo, removeTodo, updateTodo } from './TodoSlice';
import useTodoFocus from '../../hooks/useTodoFocus';
import useTodoEscape from '../../hooks/useTodoEscape';

interface TodoItemProps {
  id: string;
  title: string;
  completed: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({ id, title, completed }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const editInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  useTodoFocus(editInputRef, isEditing);
  useTodoEscape(() => setIsEditing(false));

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdate = () => {
    if (editTitle.trim()) {
      dispatch(updateTodo({ id, title: editTitle.trim() }));
    } else {
      dispatch(removeTodo(id));
    }
    setIsEditing(false);
  };

  return (
    <li className={`${completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={completed}
          onChange={() => dispatch(toggleTodo(id))}
        />
        <label onDoubleClick={handleEdit}>{title}</label>
        <button className="destroy" onClick={() => dispatch(removeTodo(id))} />
      </div>
      {isEditing && (
        <input
          ref={editInputRef}
          className="edit"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={handleUpdate}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleUpdate();
          }}
        />
      )}
    </li>
  );
};

export default TodoItem;
