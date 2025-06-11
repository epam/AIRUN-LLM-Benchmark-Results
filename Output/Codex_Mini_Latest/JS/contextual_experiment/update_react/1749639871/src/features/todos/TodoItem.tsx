import React, { useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from 'react';
import classNames from 'classnames';
import { Todo } from './types';

interface TodoItemProps {
  todo: Todo;
  editing: boolean;
  onToggle: () => void;
  onDestroy: () => void;
  onEdit: () => void;
  onSave: (text: string) => void;
  onCancel: () => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, editing, onToggle, onDestroy, onEdit, onSave, onCancel }) => {
  const [editText, setEditText] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
    }
  }, [editing, todo.title]);

  const handleSubmit = () => {
    const value = editText.trim();
    if (value) {
      onSave(value);
      setEditText(value);
    } else {
      onDestroy();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setEditText(todo.title);
      onCancel();
    } else if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <li className={classNames({ completed: todo.completed, editing })}>
      <div className="view">
        <input className="toggle" type="checkbox" checked={todo.completed} onChange={onToggle} />
        <label onDoubleClick={onEdit}>{todo.title}</label>
        <button className="destroy" onClick={onDestroy} />
      </div>
      <input
        ref={inputRef}
        className="edit"
        value={editText}
        onBlur={handleSubmit}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </li>
  );
};