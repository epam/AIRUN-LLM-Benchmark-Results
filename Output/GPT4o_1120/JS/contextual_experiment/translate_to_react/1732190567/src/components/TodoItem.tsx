import React, { useState } from 'react';
import { useAppDispatch } from '../hooks/reduxHooks';
import { toggleTodo, editTodo, deleteTodo } from '../store/todoSlice';
import useTodoEscape from '../hooks/useTodoEscape';
import useTodoFocus from '../hooks/useTodoFocus';

interface TodoItemProps {
  id: string;
  title: string;
  completed: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({ id, title, completed }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(title);
  const dispatch = useAppDispatch();
  const inputRef = useTodoFocus(isEditing);

  const handleToggle = () => {
    dispatch(toggleTodo(id));
  };

  const handleDelete = () => {
    dispatch(deleteTodo(id));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };

  const handleEditSubmit = () => {
    if (editText.trim()) {
      dispatch(editTodo({ id, title: editText.trim() }));
    } else {
      dispatch(deleteTodo(id));
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(title);
    setIsEditing(false);
  };

  useTodoEscape(handleCancelEdit);

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
          <button className="destroy" onClick={handleDelete}></button>
        </div>
      ) : (
        <input
          ref={inputRef}
          className="edit"
          value={editText}
          onChange={handleEditChange}
          onBlur={handleEditSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleEditSubmit();
          }}
        />
      )}
    </li>
  );
};

export default TodoItem;