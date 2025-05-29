import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toggleTodo, deleteTodo, updateTodo, setEditingId } from '../store/todosSlice';
import { ENTER_KEY, ESCAPE_KEY } from '../constants';
import { ITodoItemProps } from '../types';

export const TodoItem: React.FC<ITodoItemProps> = ({ todo, editing }) => {
  const dispatch = useDispatch();
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

  const handleToggle = () => {
    dispatch(toggleTodo(todo.id));
  };

  const handleDestroy = () => {
    dispatch(deleteTodo(todo.id));
  };

  const handleEdit = () => {
    dispatch(setEditingId(todo.id));
    setEditText(todo.title);
  };

  const handleSubmit = () => {
    const val = editText.trim();
    if (val) {
      dispatch(updateTodo({ id: todo.id, title: val }));
      dispatch(setEditingId(null));
      setEditText(val);
    } else {
      handleDestroy();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === ESCAPE_KEY) {
      setEditText(todo.title);
      dispatch(setEditingId(null));
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
          onChange={handleToggle}
        />
        <label onDoubleClick={handleEdit}>
          {todo.title}
        </label>
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