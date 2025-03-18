```typescript
import React, { useState } from 'react';
import classNames from 'classnames';
import { ITodoItemProps, ITodoItemState } from '../types';
import { ENTER_KEY, ESCAPE_KEY } from '../constants';

const TodoItem: React.FC<ITodoItemProps> = ({ todo, onToggle, onDestroy, onEdit, editing, onSave, onCancel }) => {
  const [editText, setEditText] = useState(todo.title);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
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
      onCancel(event);
    } else if (event.keyCode === ENTER_KEY) {
      handleSubmit(event);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value);
  };

  return (
    <li className={classNames({ completed: todo.completed, editing })}>
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
```