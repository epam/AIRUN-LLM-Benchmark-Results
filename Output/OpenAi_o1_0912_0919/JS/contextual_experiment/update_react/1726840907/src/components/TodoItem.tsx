import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { toggleTodo, destroyTodo, saveTodo } from '../store/todosSlice';
import { ENTER_KEY, ESCAPE_KEY } from '../constants';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

const TodoItem: React.FC<{ todo: Todo }> = ({ todo }) => {
  const [editText, setEditText] = useState(todo.title);
  const [editing, setEditing] = useState(false);
  const editField = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const handleSubmit = () => {
    const val = editText.trim();
    if (val) {
      dispatch(saveTodo({ id: todo.id, title: val }));
      setEditText(val);
    } else {
      dispatch(destroyTodo(todo.id));
    }
    setEditing(false);
  };

  const handleEdit = () => {
    setEditing(true);
    setEditText(todo.title);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
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

  useEffect(() => {
    if (editing && editField.current) {
      editField.current.focus();
      editField.current.setSelectionRange(editText.length, editText.length);
    }
  }, [editing]);

  return (
    <li className={classNames({ completed: todo.completed, editing })}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={() => dispatch(toggleTodo(todo.id))}
        />
        <label onDoubleClick={handleEdit}>{todo.title}</label>
        <button className="destroy" onClick={() => dispatch(destroyTodo(todo.id))} />
      </div>
      {editing && (
        <input
          ref={editField}
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