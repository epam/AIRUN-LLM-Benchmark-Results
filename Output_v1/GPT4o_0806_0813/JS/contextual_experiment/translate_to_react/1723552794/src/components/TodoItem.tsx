import React, { useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { editTodo, toggleTodo, removeTodo } from '../store/todoSlice';
import useTodoEscape from '../hooks/useTodoEscape';
import useTodoFocus from '../hooks/useTodoFocus';

interface TodoItemProps {
  id: string;
  title: string;
  completed: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({ id, title, completed }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const dispatch = useAppDispatch();
  const editInputRef = useTodoFocus(isEditing);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(e.target.value);
  };

  const handleSubmit = () => {
    if (editTitle.trim()) {
      dispatch(editTodo({ id, title: editTitle.trim() }));
    } else {
      dispatch(removeTodo(id));
    }
    setIsEditing(false);
  };

  const handleToggle = () => {
    dispatch(toggleTodo(id));
  };

  const handleRemove = () => {
    dispatch(removeTodo(id));
  };

  useTodoEscape(() => {
    if (isEditing) {
      setEditTitle(title);
      setIsEditing(false);
    }
  });

  return (
    <li className={`${completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`}>
      <div className="view">
        <input className="toggle" type="checkbox" checked={completed} onChange={handleToggle} />
        <label onDoubleClick={handleEdit}>{title}</label>
        <button className="destroy" onClick={handleRemove}></button>
      </div>
      {isEditing && (
        <input
          ref={editInputRef}
          className="edit"
          value={editTitle}
          onChange={handleChange}
          onBlur={handleSubmit}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
      )}
    </li>
  );
};

export default TodoItem;
