import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { toggleTodo, removeTodo, editTodo } from '../features/todos/todosSlice';
import { Todo } from '../features/todos/types';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const editInputRef = useRef<HTMLInputElement>(null);

  const handleToggle = () => {
    dispatch(toggleTodo(todo.id));
  };

  const handleRemove = () => {
    dispatch(removeTodo(todo.id));
  };

  const handleDoubleClick = () => {
    setEditing(true);
    setEditedTitle(todo.title);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    const newTitle = editedTitle.trim();
    if (newTitle) {
      dispatch(editTodo({ id: todo.id, title: newTitle }));
    } else {
      dispatch(removeTodo(todo.id));
    }
    setEditing(false);
  };

  const handleBlur = () => {
    handleSubmit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setEditedTitle(todo.title);
      setEditing(false);
    } else if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  useEffect(() => {
    if (editing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editing]);

  let liClassName = '';
  if (todo.completed) {
    liClassName += 'completed';
  }
  if (editing) {
    liClassName += ' editing';
  }

  return (
    <li className={liClassName.trim()}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
        />
        <label onDoubleClick={handleDoubleClick}>{todo.title}</label>
        <button className="destroy" onClick={handleRemove}></button>
      </div>
      {editing && (
        <form onSubmit={handleSubmit}>
          <input
            ref={editInputRef}
            className="edit"
            value={editedTitle}
            onChange={handleEditChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
        </form>
      )}
    </li>
  );
};

export default TodoItem;
