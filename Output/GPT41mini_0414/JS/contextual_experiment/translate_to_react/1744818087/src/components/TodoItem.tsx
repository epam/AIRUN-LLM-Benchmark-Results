import React, { useState, useEffect, useRef } from 'react';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  editing: boolean;
  onToggle: () => void;
  onRemove: () => void;
  onEditStart: () => void;
  onEditCancel: () => void;
  onEditDone: (id: string, title: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  editing,
  onToggle,
  onRemove,
  onEditStart,
  onEditCancel,
  onEditDone,
}) => {
  const [editText, setEditText] = useState(todo.title);
  const editFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && editFieldRef.current) {
      editFieldRef.current.focus();
      editFieldRef.current.setSelectionRange(editFieldRef.current.value.length, editFieldRef.current.value.length);
    }
  }, [editing]);

  useEffect(() => {
    if (!editing) {
      setEditText(todo.title);
    }
  }, [todo.title, editing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = editText.trim();
    if (trimmed.length === 0) {
      onRemove();
    } else {
      onEditDone(todo.id, trimmed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditText(todo.title);
      onEditCancel();
    } else if (e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  return (
    <li className={`${todo.completed ? 'completed' : ''} ${editing ? 'editing' : ''}`}>
      <div className="view">
        <input className="toggle" type="checkbox" checked={todo.completed} onChange={onToggle} />
        <label onDoubleClick={onEditStart}>{todo.title}</label>
        <button className="destroy" onClick={onRemove}></button>
      </div>
      {editing && (
        <form onSubmit={handleSubmit}>
          <input
            className="edit"
            ref={editFieldRef}
            value={editText}
            onChange={handleChange}
            onBlur={handleSubmit}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </form>
      )}
    </li>
  );
};
