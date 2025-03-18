import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { toggleTodo, deleteTodo, editTodo } from '../store/todosSlice';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);
  const editFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && editFieldRef.current) {
      editFieldRef.current.focus();
      editFieldRef.current.setSelectionRange(editFieldRef.current.value.length, editFieldRef.current.value.length);
    }
  }, [editing]);

  const handleToggle = () => {
    dispatch(toggleTodo(todo.id));
  };

  const handleDelete = () => {
    dispatch(deleteTodo(todo.id));
  };

  const handleEdit = () => {
    setEditing(true);
    setEditText(todo.title);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };

  const handleSubmit = () => {
    const trimmedText = editText.trim();
    if (trimmedText) {
      dispatch(editTodo({ id: todo.id, title: trimmedText }));
      setEditing(false);
    } else {
      dispatch(deleteTodo(todo.id));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setEditText(todo.title);
      setEditing(false);
    } else if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <li className={classNames({ completed: todo.completed, editing })}>
      <div className="view">
        <input className="toggle" type="checkbox" checked={todo.completed} onChange={handleToggle} />
        <label onDoubleClick={handleEdit}>{todo.title}</label>
        <button className="destroy" onClick={handleDelete} />
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

export default React.memo(TodoItem, (prevProps, nextProps) => 
  prevProps.todo === nextProps.todo
);
