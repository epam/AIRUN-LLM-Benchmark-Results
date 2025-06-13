import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';

import { Todo } from '../types';
import { toggleTodo, saveTodo, destroyTodo } from '../store/todosSlice';
import { ENTER_KEY, ESCAPE_KEY } from '../constants';

interface TodoItemProps {
  todo: Todo;
  isEditing: boolean;
  onStartEdit: () => void;
  onEndEdit: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, isEditing, onStartEdit, onEndEdit }) => {
  const dispatch = useDispatch();
  const [editText, setEditText] = useState(todo.title);
  const editFieldRef = useRef<HTMLInputElement>(null);

  const handleToggle = () => {
    dispatch(toggleTodo(todo.id));
  };

  const handleDestroy = () => {
    dispatch(destroyTodo(todo.id));
  };

  const handleEdit = () => {
    onStartEdit();
  };

  const handleSubmit = () => {
    const val = editText.trim();
    if (val) {
      dispatch(saveTodo({ id: todo.id, title: val }));
      setEditText(val);
    } else {
      handleDestroy();
    }
    onEndEdit();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === ESCAPE_KEY) {
      setEditText(todo.title);
      onEndEdit();
    } else if (event.key === ENTER_KEY) {
      handleSubmit();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value);
  };

  useEffect(() => {
    if (isEditing) {
      editFieldRef.current?.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditText(todo.title);
  }, [todo.title]);

  return (
    <li
      className={classNames({
        completed: todo.completed,
        editing: isEditing,
      })}
    >
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
        />
        <label onDoubleClick={handleEdit}>{todo.title}</label>
        <button className="destroy" onClick={handleDestroy} />
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
};

export default React.memo(TodoItem);
