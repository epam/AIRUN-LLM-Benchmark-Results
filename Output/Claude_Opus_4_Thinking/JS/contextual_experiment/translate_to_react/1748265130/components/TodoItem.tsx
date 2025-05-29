import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleTodo, updateTodo, removeTodo } from '../store/todoSlice';
import { Todo } from '../types/todo';
import { useAutoFocus } from '../hooks/useAutoFocus';
import { useEscapeKey } from '../hooks/useEscapeKey';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);
  const [originalText, setOriginalText] = useState(todo.title);

  const autoFocusRef = useAutoFocus(isEditing);
  const escapeRef = useEscapeKey(() => {
    if (isEditing) {
      revertEditing();
    }
  });

  const handleToggle = () => {
    dispatch(toggleTodo(todo.id));
  };

  const handleDestroy = () => {
    dispatch(removeTodo(todo.id));
  };

  const handleEdit = () => {
    setOriginalText(todo.title);
    setEditText(todo.title);
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doneEditing();
  };

  const doneEditing = () => {
    const trimmedText = editText.trim();
    if (trimmedText.length === 0) {
      dispatch(removeTodo(todo.id));
    } else {
      dispatch(updateTodo({ id: todo.id, title: trimmedText }));
    }
    setIsEditing(false);
  };

  const revertEditing = () => {
    setEditText(originalText);
    setIsEditing(false);
  };

  const combineRefs = (el: HTMLInputElement | null) => {
    (autoFocusRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
    (escapeRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
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
        <button className="destroy" onClick={handleDestroy}></button>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          ref={combineRefs}
          className="edit"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={doneEditing}
        />
      </form>
    </li>
  );
};

export default TodoItem;