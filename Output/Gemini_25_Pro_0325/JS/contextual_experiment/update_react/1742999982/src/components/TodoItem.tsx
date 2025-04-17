import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import { Todo } from '../features/todos/types';
import { toggleTodo, deleteTodo, editTodo } from '../features/todos/todosSlice';
import { ENTER_KEY, ESCAPE_KEY } from '../utils/constants';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);
  const editFieldRef = useRef<HTMLInputElement>(null);

  const handleToggle = () => {
    dispatch(toggleTodo(todo.id));
  };

  const handleDestroy = () => {
    dispatch(deleteTodo(todo.id));
  };

  const handleEdit = () => {
    setEditing(true);
    setEditText(todo.title);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value);
  };

  const handleSubmit = () => {
    const val = editText.trim();
    if (val) {
      dispatch(editTodo({ id: todo.id, title: val }));
      setEditText(val);
    } else {
      handleDestroy();
    }
    setEditing(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape' || event.keyCode === ESCAPE_KEY) {
      setEditText(todo.title);
      setEditing(false);
    } else if (event.key === 'Enter' || event.keyCode === ENTER_KEY) {
      handleSubmit();
    }
  };

  useEffect(() => {
    if (editing && editFieldRef.current) {
      editFieldRef.current.focus();
      editFieldRef.current.setSelectionRange(editText.length, editText.length);
    }
  }, [editing, editText.length]);

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
          onChange={handleToggle}
        />
        <label onDoubleClick={handleEdit}>{todo.title}</label>
        <button className="destroy" onClick={handleDestroy} />
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

export default TodoItem;
