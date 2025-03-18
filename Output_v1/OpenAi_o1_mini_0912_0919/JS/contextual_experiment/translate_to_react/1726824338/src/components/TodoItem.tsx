```typescript
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { toggleTodo, removeTodo, editTodo } from '../store/todosSlice';

interface TodoItemProps {
  id: string;
  title: string;
  completed: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({ id, title, completed }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const editFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editFieldRef.current) {
      editFieldRef.current.focus();
    }
  }, [isEditing]);

  const handleToggle = () => {
    dispatch(toggleTodo(id));
  };

  const handleRemove = () => {
    dispatch(removeTodo(id));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = editedTitle.trim();
    if (trimmedTitle) {
      dispatch(editTodo({ id, title: trimmedTitle }));
    } else {
      dispatch(removeTodo(id));
    }
    setIsEditing(false);
  };

  const handleEscape = () => {
    setEditedTitle(title);
    setIsEditing(false);
  };

  return (
    <li className={`${completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`}>
      {!isEditing ? (
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={completed}
            onChange={handleToggle}
          />
          <label onDoubleClick={handleEdit}>{title}</label>
          <button className="destroy" onClick={handleRemove}></button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            ref={editFieldRef}
            className="edit"
            value={editedTitle}
            onChange={handleChange}
            onBlur={handleSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                handleEscape();
              }
            }}
          />
        </form>
      )}
    </li>
  );
};

export default TodoItem;
```