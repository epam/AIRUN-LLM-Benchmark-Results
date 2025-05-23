```typescript
import classNames from 'classnames';
import React, { useState, useRef, useEffect } from 'react';
import { ENTER_KEY, ESCAPE_KEY } from '../../constants';
import { ITodoItemProps } from '../../types';

export const TodoItem: React.FC<ITodoItemProps> = React.memo(
  ({ todo, onToggle, onDestroy, onEdit, editing, onSave, onCancel }) => {
    const [editText, setEditText] = useState(todo.title);
    const editFieldRef = useRef<HTMLInputElement>(null);

    const handleSubmit = () => {
      const val = editText.trim();
      if (val) {
        onSave(val);
        setEditText(val);
      } else {
        onDestroy();
      }
    };

    const handleEdit = () => {
      onEdit();
      setEditText(todo.title);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.keyCode === ESCAPE_KEY) {
        setEditText(todo.title);
        onCancel();
      } else if (event.keyCode === ENTER_KEY) {
        handleSubmit();
      }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setEditText(event.target.value);
    };

    useEffect(() => {
      if (editing && editFieldRef.current) {
        editFieldRef.current.focus();
        editFieldRef.current.setSelectionRange(
          editFieldRef.current.value.length,
          editFieldRef.current.value.length
        );
      }
    }, [editing]);

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
          <label onDoubleClick={handleEdit}>{todo.title}</label>
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
  }
);
```