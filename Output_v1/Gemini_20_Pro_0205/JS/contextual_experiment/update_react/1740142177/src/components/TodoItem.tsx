import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { useAppDispatch } from '../store/hooks';
import { toggleTodo, deleteTodo, editTodo } from '../store/todoSlice';

interface TodoItemProps {
  todo: { id: string; title: string; completed: boolean };
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);
  const editFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      editFieldRef.current?.focus();
    }
  }, [editing]);

  const handleSubmit = () => {
    const val = editText.trim();
    if (val) {
      dispatch(editTodo({ id: todo.id, title: val }));
      setEditText(val);
    } else {
      dispatch(deleteTodo(todo.id));
    }
    setEditing(false);
  };

  const handleEdit = () => {
    setEditing(true);
    setEditText(todo.title);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditText(todo.title);
      setEditing(false);
    } else if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value);
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
