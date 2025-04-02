import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { ENTER_KEY, ESCAPE_KEY } from '../constants';

interface ITodoItemProps {
  todo: { id: string; title: string; completed: boolean; };
  onToggle: () => void;
  onDestroy: () => void;
  onEdit: () => void;
  editing: boolean;
  onSave: (text: string) => void;
  onCancel: () => void;
}

const TodoItem: React.FC<ITodoItemProps> = ({ todo, onToggle, onDestroy, onEdit, editing, onSave, onCancel }) => {
  const [editText, setEditText] = useState(todo.title);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const val = editText.trim();
    if (val) {
      onSave(val);
    } else {
      onDestroy();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.keyCode === ESCAPE_KEY) {
      setEditText(todo.title);
      onCancel();
    } else if (event.keyCode === ENTER_KEY) {
      handleSubmit(event);
    }
  };

  useEffect(() => {
    if (editing) {
      const node = document.getElementById(`edit-${todo.id}`) as HTMLInputElement;
      if (node) {
        node.focus();
        node.setSelectionRange(node.value.length, node.value.length);
      }
    }
  }, [editing, todo.id]);

  return (
    <li className={classNames({ completed: todo.completed, editing })}>
      <div className="view">
        <input className="toggle" type="checkbox" checked={todo.completed} onChange={onToggle} />
        <label onDoubleClick={onEdit}>{todo.title}</label>
        <button className="destroy" onClick={onDestroy} />
      </div>
      <form onSubmit={handleSubmit}>
        <input
          id={`edit-${todo.id}`}
          className="edit"
          value={editText}
          onBlur={handleSubmit}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </form>
    </li>
  );
};

export { TodoItem };