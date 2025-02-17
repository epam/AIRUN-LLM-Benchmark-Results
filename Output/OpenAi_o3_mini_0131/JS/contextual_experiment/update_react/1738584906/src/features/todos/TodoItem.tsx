```tsx
import React, { useState, useEffect, useRef, KeyboardEvent, ChangeEvent, FocusEvent } from 'react';
import classNames from 'classnames';

interface TodoItemProps {
  todo: {
    id: string;
    title: string;
    completed: boolean;
  };
  onToggle: () => void;
  onDestroy: () => void;
  onEdit: () => void;
  editing: boolean;
  onSave: (text: string) => void;
  onCancel: (e: KeyboardEvent<HTMLInputElement> | FocusEvent<HTMLInputElement>) => void;
}

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDestroy, onEdit, editing, onSave, onCancel }) => {
  const [editText, setEditText] = useState<string>(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
    }
  }, [editing]);

  const handleSubmit = (e: React.FormEvent<HTMLInputElement> | FocusEvent<HTMLInputElement>) => {
    const trimmedText = editText.trim();
    if (trimmedText) {
      onSave(trimmedText);
      setEditText(trimmedText);
    } else {
      onDestroy();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === ESCAPE_KEY) {
      setEditText(todo.title);
      onCancel(e);
    } else if (e.keyCode === ENTER_KEY) {
      handleSubmit(e);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };

  const handleEdit = () => {
    onEdit();
    setEditText(todo.title);
  };

  return (
    <li className={classNames({ completed: todo.completed, editing })}>
      <div className="view">
        <input className="toggle" type="checkbox" checked={todo.completed} onChange={onToggle} />
        <label onDoubleClick={handleEdit}>{todo.title}</label>
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

export { TodoItem };
```