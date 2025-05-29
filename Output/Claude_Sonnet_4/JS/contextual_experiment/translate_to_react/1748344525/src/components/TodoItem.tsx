import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { toggleTodo, updateTodo, removeTodo } from '../store/todoSlice';
import { Todo } from '../types/todo';
import { useTodoFocus } from '../hooks/useTodoFocus';
import { useTodoEscape } from '../hooks/useTodoEscape';

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);
  const [originalTitle, setOriginalTitle] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  useTodoFocus(editInputRef, isEditing);
  useTodoEscape(editInputRef, () => {
    setEditText(originalTitle);
    setIsEditing(false);
  });

  const handleToggle = () => {
    dispatch(toggleTodo(todo.id));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setOriginalTitle(todo.title);
    setEditText(todo.title);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = editText.trim();
    if (trimmedText) {
      dispatch(updateTodo({ id: todo.id, title: trimmedText }));
    } else {
      dispatch(removeTodo(todo.id));
    }
    setIsEditing(false);
  };

  const handleBlur = () => {
    const trimmedText = editText.trim();
    if (trimmedText) {
      dispatch(updateTodo({ id: todo.id, title: trimmedText }));
    } else {
      dispatch(removeTodo(todo.id));
    }
    setIsEditing(false);
  };

  const handleRemove = () => {
    dispatch(removeTodo(todo.id));
  };

  return (
    <li className={`${todo.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
        />
        <label onDoubleClick={handleEdit}>{todo.title}</label>
        <button className="destroy" onClick={handleRemove}></button>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          ref={editInputRef}
          className="edit"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleBlur}
        />
      </form>
    </li>
  );
};
