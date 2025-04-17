import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { Todo } from '../types';
import { toggleTodo, deleteTodo, saveTodo } from '../store/todoSlice';
import { ENTER_KEY, ESCAPE_KEY } from '../constants';

interface Props {
  todo: Todo;
}

const TodoItem: React.FC<Props> = ({ todo }) => {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);
  const editFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && editFieldRef.current) {
      const node = editFieldRef.current;
      node.focus();
      node.setSelectionRange(node.value.length, node.value.length);
    }
  }, [editing]);

  const handleToggle = () => dispatch(toggleTodo(todo.id));

  const handleDestroy = () => dispatch(deleteTodo(todo.id));

  const handleEdit = () => {
    setEditing(true);
    setEditText(todo.title);
  };

  const handleSubmit = () => {
    const val = editText.trim();
    if (val) {
      dispatch(saveTodo({ id: todo.id, title: val }));
      setEditing(false);
    } else {
      dispatch(deleteTodo(todo.id));
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.keyCode === ESCAPE_KEY) {
      setEditText(todo.title);
      setEditing(false);
    } else if (e.keyCode === ENTER_KEY) {
      handleSubmit();
    }
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    setEditText(e.target.value);
  };

  return (
    <li
      className={classNames({
        completed: todo.completed,
        editing,
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

export default TodoItem;
