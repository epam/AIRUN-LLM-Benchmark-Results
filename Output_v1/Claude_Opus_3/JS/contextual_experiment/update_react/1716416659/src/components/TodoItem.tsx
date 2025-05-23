import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { toggleTodo, deleteTodo, editTodo } from '../store/todoSlice';
import { ENTER_KEY, ESCAPE_KEY } from '../utils/constants';

interface TodoItemProps {
  todo: {
    id: string;
    title: string;
    completed: boolean;
  };
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);
  const dispatch = useDispatch();
  const editFieldRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const trimmedText = editText.trim();
    if (trimmedText) {
      dispatch(editTodo({ id: todo.id, title: trimmedText }));
      setEditing(false);
    } else {
      dispatch(deleteTodo(todo.id));
    }
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
    if (editing) {
      editFieldRef.current?.focus();
      editFieldRef.current?.setSelectionRange(
        editText.length,
        editText.length
      );
    }
  }, [editing, editText]);

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
          onChange={() => dispatch(toggleTodo(todo.id))}
        />
        <label onDoubleClick={handleEdit}>{todo.title}</label>
        <button className="destroy" onClick={() => dispatch(deleteTodo(todo.id))} />
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
