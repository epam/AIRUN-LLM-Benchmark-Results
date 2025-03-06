import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { useAppDispatch } from '../store';
import { toggleTodo, removeTodo, editTodo } from '../store/todoSlice';
import { ENTER_KEY, ESCAPE_KEY } from '../constants';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);
  const editFieldRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

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
      dispatch(editTodo({ id: todo.id, title: val }));
      setEditText(val);
      setEditing(false);
    } else {
      dispatch(removeTodo(todo.id));
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setEditText(todo.title);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.keyCode === ESCAPE_KEY) {
      setEditText(todo.title);
      setEditing(false);
    } else if (event.keyCode === ENTER_KEY) {
      handleSubmit();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value);
  };

  const handleToggle = () => {
    dispatch(toggleTodo(todo.id));
  };

  const handleDestroy = () => {
    dispatch(removeTodo(todo.id));
  };

  return (
    <li className={classNames({
      completed: todo.completed,
      editing: editing
    })}>
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

export default TodoItem;