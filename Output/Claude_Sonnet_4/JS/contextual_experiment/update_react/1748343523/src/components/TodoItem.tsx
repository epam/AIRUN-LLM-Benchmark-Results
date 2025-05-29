import React, { useState, useEffect, useRef, KeyboardEvent, FormEvent } from 'react';
import classNames from 'classnames';
import { TodoItemProps } from '../types';
import { ENTER_KEY, ESCAPE_KEY } from '../constants';

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  editing,
  onToggle,
  onDestroy,
  onEdit,
  onSave,
  onCancel
}) => {
  const [editText, setEditText] = useState(todo.title);
  const editFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && editFieldRef.current) {
      editFieldRef.current.focus();
      editFieldRef.current.setSelectionRange(
        editFieldRef.current.value.length,
        editFieldRef.current.value.length
      );
    }
  }, [editing]);

  useEffect(() => {
    setEditText(todo.title);
  }, [todo.title]);

  const handleSubmit = (event: FormEvent) => {
    const val = editText.trim();
    if (val) {
      onSave(todo.id, val);
      setEditText(val);
    } else {
      onDestroy(todo.id);
    }
  };

  const handleEdit = () => {
    onEdit(todo.id);
    setEditText(todo.title);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ESCAPE_KEY) {
      setEditText(todo.title);
      onCancel();
    } else if (event.key === ENTER_KEY) {
      handleSubmit(event);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value);
  };

  return (
    <li className={classNames({
      completed: todo.completed,
      editing: editing
    })}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        <label onDoubleClick={handleEdit}>
          {todo.title}
        </label>
        <button className="destroy" onClick={() => onDestroy(todo.id)} />
      </div>
      <input
        ref={editFieldRef}
        className="edit"
        value={editText}
        onBlur={handleSubmit}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </li>
  );
};