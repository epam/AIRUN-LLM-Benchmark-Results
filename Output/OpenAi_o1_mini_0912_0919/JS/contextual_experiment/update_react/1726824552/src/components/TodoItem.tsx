```typescript
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import { toggle, destroy, save } from '../store/todosSlice';
import { ENTER_KEY, ESCAPE_KEY } from '../constants';

interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}

interface ITodoItemProps {
  todo: ITodo;
}

const TodoItem: React.FC<ITodoItemProps> = ({ todo }) => {
  const dispatch = useDispatch();
  const [editText, setEditText] = useState(todo.title);
  const [editing, setEditing] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = editText.trim();
    if (trimmedText) {
      dispatch(save({ id: todo.id, title: trimmedText }));
      setEditText(trimmedText);
      setEditing(false);
    } else {
      dispatch(destroy(todo.id));
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setEditText(todo.title);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === ESCAPE_KEY) {
      setEditText(todo.title);
      setEditing(false);
    } else if (e.keyCode === ENTER_KEY) {
      handleSubmit(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
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
          onChange={() => dispatch(toggle(todo.id))}
        />
        <label onDoubleClick={handleEdit}>{todo.title}</label>
        <button
          className="destroy"
          onClick={() => dispatch(destroy(todo.id))}
        />
      </div>
      {editing && (
        <input
          ref={editFieldRef}
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

export default React.memo(TodoItem);
```