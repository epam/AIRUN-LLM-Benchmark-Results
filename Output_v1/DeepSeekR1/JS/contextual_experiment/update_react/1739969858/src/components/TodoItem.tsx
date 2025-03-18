import { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { ITodo, TodoItemProps } from '../app/types';
import { ESCAPE_KEY, ENTER_KEY } from '../app/constants';

export const TodoItem = ({ todo, editing, onEdit, onCancel, onSave }: TodoItemProps) => {
  const [editText, setEditText] = useState(todo.title);
  const editFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && editFieldRef.current) {
      editFieldRef.current.focus();
      editFieldRef.current.setSelectionRange(editText.length, editText.length);
    }
  }, [editing]);

  const handleSubmit = () => {
    const val = editText.trim();
    if (val) {
      onSave(val);
    } else {
      onCancel();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={onEdit}
        />
        <label onDoubleClick={onEdit}>{todo.title}</label>
        <button className="destroy" onClick={onCancel} />
      </div>
      <input
        ref={editFieldRef}
        className="edit"
        value={editText}
        onBlur={handleSubmit}
        onChange={(e) => setEditText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </li>
  );
};
