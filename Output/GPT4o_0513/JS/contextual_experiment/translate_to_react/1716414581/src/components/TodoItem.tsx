import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { toggleTodo, editTodo, removeTodo } from '../store/todoSlice';
import useTodoFocus from '../directives/useTodoFocus';
import useTodoEscape from '../directives/useTodoEscape';

interface TodoItemProps {
  id: string;
  title: string;
  completed: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({ id, title, completed }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(title);
  const editInputRef = useRef<HTMLInputElement>(null);

  useTodoFocus(editInputRef, isEditing);
  useTodoEscape(editInputRef, () => setIsEditing(false));

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };

  const handleBlur = () => {
    if (isEditing) {
      dispatch(editTodo({ id, title: editText.trim() }));
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
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
          value={editText}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      )}
    </li>
  );
};

export default TodoItem;
