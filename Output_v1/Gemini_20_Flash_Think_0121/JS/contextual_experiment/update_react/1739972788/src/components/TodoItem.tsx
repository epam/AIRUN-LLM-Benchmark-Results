import React, { useState, useEffect, useRef, useCallback } from 'react';
import classNames from 'classnames';
import { ENTER_KEY, ESCAPE_KEY } from '../constants';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDestroy: () => void;
  onEdit: () => void;
  editing: boolean;
  onSave: (text: string) => void;
  onCancel: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDestroy,
  onEdit,
  editing,
  onSave,
  onCancel,
}) => {
  const [editText, setEditText] = useState(todo.title);
  const editFieldRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(() => {
    const val = editText.trim();
    if (val) {
      onSave(val);
      setEditText(val);
    } else {
      onDestroy();
    }
  }, [editText, onSave, onDestroy]);

  const handleEdit = useCallback(() => {
    onEdit();
    setEditText(todo.title);
  }, [onEdit, todo.title]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.keyCode === ESCAPE_KEY) {
      setEditText(todo.title);
      onCancel();
    } else if (event.keyCode === ENTER_KEY) {
      handleSubmit();
    }
  }, [todo.title, onCancel, handleSubmit]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value);
  }, []);

  useEffect(() => {
    if (editing && editFieldRef.current) {
      editFieldRef.current.focus();
      editFieldRef.current.setSelectionRange(editText.length, editText.length);
    }
  }, [editing, editText.length]);

  return (
    <li className={classNames({
      completed: todo.completed,
      editing
    })}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={onToggle}
        />
        <label onDoubleClick={handleEdit}>
          {todo.title}
        </label>
        <button className="destroy" onClick={onDestroy} />
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

export default TodoItem;