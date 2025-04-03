import { useState, useEffect, useRef } from 'react';
import { ENTER_KEY, ESCAPE_KEY } from '../constants';

interface TodoItemProps {
  todo: {
    id: string;
    title: string;
    completed: boolean;
  };
  editing: boolean;
  onToggle: () => void;
  onDestroy: () => void;
  onEdit: () => void;
  onSave: (text: string) => void;
  onCancel: () => void;
}

export const TodoItem = ({
  todo,
  editing,
  onToggle,
  onDestroy,
  onEdit,
  onSave,
  onCancel
}: TodoItemProps) => {
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

  const handleSubmit = () => {
    const val = editText.trim();
    if (val) {
      onSave(val);
    } else {
      onDestroy();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === ESCAPE_KEY) {
      setEditText(todo.title);
      onCancel();
    } else if (e.keyCode === ENTER_KEY) {
      handleSubmit();
    }
  };

  return (
    <li className={`${todo.completed ? 'completed' : ''} ${editing ? 'editing' : ''}`}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={onToggle}
        />
        <label onDoubleClick={onEdit}>
          {todo.title}
        </label>
        <button className="destroy" onClick={onDestroy} />
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