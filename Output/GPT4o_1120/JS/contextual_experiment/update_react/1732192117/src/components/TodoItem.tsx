import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { ENTER_KEY, ESCAPE_KEY } from '../utils/constants';

interface TodoItemProps {
  todo: {
    id: string;
    title: string;
    completed: boolean;
  };
  onToggle: () => void;
  onDestroy: () => void;
  onEdit: () => void;
  onSave: (text: string) => void;
  onCancel: () => void;
  editing: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDestroy,
  onEdit,
  onSave,
  onCancel,
  editing,
}) => {
  const [editText, setEditText] = useState(todo.title);

  useEffect(() => {
    if (editing) {
      const node = document.getElementById(`edit-${todo.id}`) as HTMLInputElement;
      if (node) {
        node.focus();
        node.setSelectionRange(node.value.length, node.value.length);
      }
    }
  }, [editing, todo.id]);

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
    if (event.key === 'Escape') {
      setEditText(todo.title);
      onCancel();
    } else if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value);
  };

  return (
    <li
      className={classNames({
        completed: todo.completed,
        editing: editing,
      })}
    >
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={onToggle}
        />
        <label onDoubleClick={onEdit}>{todo.title}</label>
        <button className="destroy" onClick={onDestroy} />
      </div>
      {editing && (
        <input
          id={`edit-${todo.id}`}
          className="edit"
          value={editText}
          onBlur={handleSubmit}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      )}
    </li>
  );
};

export default TodoItem;