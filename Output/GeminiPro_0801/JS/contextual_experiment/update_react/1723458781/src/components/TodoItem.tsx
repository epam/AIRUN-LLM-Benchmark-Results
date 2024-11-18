import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { ESCAPE_KEY, ENTER_KEY } from '../constants';
import { ITodo } from '../store/todosSlice';

interface ITodoItemProps {
  todo: ITodo;
  onToggle: () => void;
  onDestroy: () => void;
  onEdit: () => void;
  onSave: (text: string) => void;
}

const TodoItem: React.FC<ITodoItemProps> = ({ todo, onToggle, onDestroy, onEdit, onSave }) => {
  const [editText, setEditText] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
    }
  }, [todo.editing]);

  const handleSubmit = (event: React.FormEvent) => {
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ESCAPE_KEY) {
      setEditText(todo.title);
      event.preventDefault();
      event.stopPropagation();
      document.activeElement?.blur();
    } else if (event.key === ENTER_KEY) {
      handleSubmit(event);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value);
  };

  return (
    <li className={classNames({ completed: todo.completed, editing: todo.editing })}>
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

export default TodoItem;
