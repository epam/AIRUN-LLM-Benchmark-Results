import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { ENTER_KEY, ESCAPE_KEY } from '../constants';

interface TodoItemProps {
  todo: { id: string; title: string; completed: boolean };
  editing: boolean;
  onToggle: () => void;
  onDestroy: () => void;
  onEdit: () => void;
  onSave: (title: string) => void;
  onCancel: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
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
      editFieldRef.current.setSelectionRange(editText.length, editText.length);
    }
  }, [editing]);

  const handleSubmit = () => {
    const val = editText.trim();
    if (val) {
      onSave(val);
      setEditText(val);
    } else {
      onDestroy();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === ESCAPE_KEY) {
      setEditText(todo.title);
      onCancel();
    } else if (event.key === ENTER_KEY) {
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
        ref={editFieldRef}
        className="edit"
        value={editText}
        onBlur={handleSubmit}
        onChange={e => setEditText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </li>
  );
};

export default TodoItem;