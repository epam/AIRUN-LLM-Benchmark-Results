import React, { useState } from 'react';
import { useAppDispatch } from '../store/store';
import { toggleTodo, removeTodo, updateTodo } from '../store/todoSlice';

interface TodoItemProps {
  id: string;
  title: string;
  completed: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({ id, title, completed }) => {
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(title);

  const handleToggle = () => dispatch(toggleTodo(id));
  const handleRemove = () => dispatch(removeTodo(id));
  const handleEdit = () => setEditing(true);
  const handleSave = () => {
    if (editText.trim()) {
      dispatch(updateTodo({ id, title: editText }));
      setEditing(false);
    }
  };
  const handleCancel = () => {
    setEditText(title);
    setEditing(false);
  };

  return (
    <li className={completed ? 'completed' : ''}>
      <div className="view">
        <input className="toggle" type="checkbox" checked={completed} onChange={handleToggle} />
        <label onDoubleClick={handleEdit}>{title}</label>
        <button className="destroy" onClick={handleRemove}></button>
      </div>
      {editing ? (
        <input
          className="edit"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => e.key === 'Escape' && handleCancel()}
        />
      ) : null}
    </li>
  );
};

export default TodoItem;