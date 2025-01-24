import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toggleTodo, updateTodo, deleteTodo } from '../todosSlice';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const handleToggle = () => {
    dispatch(toggleTodo(todo.id));
  };

  const handleEdit = () => {
    setEditing(true);
    setTitle(todo.title);
  };

  const handleSave = () => {
    if (title.trim() === '') {
      dispatch(deleteTodo(todo.id));
    } else {
      dispatch(updateTodo({ id: todo.id, title: title.trim() }));
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSave();
    } else if (event.key === 'Escape') {
      handleCancel();
    }
  };

  const handleDelete = () => {
    dispatch(deleteTodo(todo.id));
  };

  return (
    <li className={editing ? 'editing' : todo.completed ? 'completed' : ''}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
        />
        <label onDoubleClick={handleEdit}>{todo.title}</label>
        <button className="destroy" onClick={handleDelete} />
      </div>
      {editing && (
        <input
          ref={inputRef}
          className="edit"
          value={title}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
        />
      )}
    </li>
  );
};

export default TodoItem;
