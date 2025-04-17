import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Todo } from '../types';
import { toggleTodo, removeTodo, editTodo } from '../store/todosSlice';
import { AppDispatch } from '../store/store';
import { useTodoFocus } from '../hooks/useTodoFocus';
import { useEscapeKey } from '../hooks/useEscapeKey';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const editInputRef = useTodoFocus(isEditing);
  const originalTitleRef = useRef(todo.title); // Store original title for revert

  const handleToggle = () => {
    dispatch(toggleTodo(todo.id));
  };

  const handleRemove = () => {
    dispatch(removeTodo(todo.id));
  };

  const handleDoubleClick = () => {
    originalTitleRef.current = todo.title; // Store current title before editing
    setEditedTitle(todo.title); // Reset edit input to current title
    setIsEditing(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const handleSubmit = () => {
    const trimmedTitle = editedTitle.trim();
    if (isEditing) { // Only submit if currently editing
        if (trimmedTitle) {
            if (trimmedTitle !== todo.title) {
                dispatch(editTodo({ id: todo.id, title: trimmedTitle }));
            }
            setIsEditing(false);
        } else {
            // If the title is empty after trimming, remove the todo
            handleRemove();
            // No need to setIsEditing(false) as the component will unmount
        }
    }
  };


  const handleBlur = () => {
    // Submit on blur only if currently editing
    handleSubmit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleCancelEdit = () => {
    if (isEditing) { // Only cancel if currently editing
        setEditedTitle(originalTitleRef.current); // Revert to original title
        setIsEditing(false);
    }
  };

  // Use the escape key hook, only active when editing
  useEscapeKey(handleCancelEdit);


  const liClassName = [
    todo.completed ? 'completed' : '',
    isEditing ? 'editing' : '',
  ].join(' ').trim();

  return (
    <li className={liClassName}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
        />
        <label onDoubleClick={handleDoubleClick}>{todo.title}</label>
        <button className="destroy" onClick={handleRemove}></button>
      </div>
      {isEditing && (
        <input
          ref={editInputRef}
          className="edit"
          value={editedTitle}
          onChange={handleEditChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown} // Handle Enter key
        />
      )}
    </li>
  );
};

export default TodoItem;
