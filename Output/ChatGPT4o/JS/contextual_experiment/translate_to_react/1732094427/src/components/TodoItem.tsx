import React, { useState } from 'react';
import { useAppDispatch } from '../hooks/reduxHooks';
import { toggleTodo, removeTodo, editTodo } from '../store/todoSlice';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { useFocus } from '../hooks/useFocus';

interface TodoItemProps {
  id: string;
  title: string;
  completed: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({ id, title, completed }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(title);
  const dispatch = useAppDispatch();
  const inputRef = useFocus(isEditing);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editText.trim()) {
      dispatch(editTodo({ id, title: editText.trim() }));
    } else {
      dispatch(removeTodo(id));
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(title);
    setIsEditing(false);
  };

  useEscapeKey(handleCancel);

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
          ref={inputRef}
          className="edit"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
          }}
        />
      )}
    </li>
  );
};

export default TodoItem;
