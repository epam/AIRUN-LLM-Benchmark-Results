import React, { useState, useRef } from 'react';
import { classNames } from 'classnames';
import { ITodoItemProps, ITodoItemState } from './types';
import { uuid } from './utils';

const TodoItem: React.FC<ITodoItemProps> = (props) => {
  const [editText, setEditText] = useState<string>(props.todo.title);
  const editInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const value = editText.trim();
    if (value) {
      props.onSave(value);
      setEditText(value);
    } else {
      props.onDestroy();
    }
  };

  const handleEdit = () => {
    props.onEdit();
    setEditText(props.todo.title);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.keyCode === 27) { // Escape
      props.onCancel(event);
      setEditText(props.todo.title);
    } else if (event.keyCode === 13) { // Enter
      handleSubmit(event);
    }
  };

  const handleChange = (event: React.FormEvent) => {
    setEditText(event.target.value);
  };

  const shouldComponentUpdate = (nextProps: ITodoItemProps, nextState: ITodoItemState) => {
    return ( 
      nextProps.todo.id !== props.todo.id || 
      nextProps.editing !== props.editing || 
      nextState.editText !== nextState.editText
    );
  };

  const componentDidUpdate = (prevProps: ITodoItemProps) => {
    if (!prevProps.editing && props.editing) {
      if (editInputRef.current) {
        editInputRef.current.focus();
        editInputRef.current.setSelectionRange(editInputRef.current.value.length, editInputRef.current.value.length);
      }
    }
  };

  return (
    <li className={classNames({ completed: props.todo.completed, editing: props.editing })}>
      <div className="view">
        <input
          type="checkbox"
          checked={props.todo.completed}
          onChange={props.onToggle}
        />
        <label
          htmlFor={\uuid()}\n          onClick={handleEdit}
        >
          {props.todo.title}
        </label>
        <button className="destroy" onClick={props.onDestroy} />
      </div>
      <input
        ref={editInputRef}
        className="edit"
        value={editText}
        onChange={handleChange}
        onBlur={handleSubmit}
        onKeyDown={handleKeyDown}
      />
    </li
  );
};

export default TodoItem;