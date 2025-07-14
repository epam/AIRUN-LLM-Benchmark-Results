import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { toggleTodo, editTodo, removeTodo } from '../features/todos/todoSlice';
import { Todo } from '../features/todos/todoSlice';

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

  const handleSave = () => {
    const trimmed = title.trim();
    if (trimmed) {
      dispatch(editTodo({ id: todo.id, title: trimmed }));
    } else {
      dispatch(removeTodo(todo.id));
    }
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setTitle(todo.title);
      setEditing(false);
    } else if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <li className={`${todo.completed ? 'completed' : ''} ${editing ? 'editing' : ''}`}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={() => dispatch(toggleTodo(todo.id))}
        />
        <label onDoubleClick={() => { setTitle(todo.title); setEditing(true); }}>
          {todo.title}
        </label>
        <button
          className="destroy"
          onClick={() => dispatch(removeTodo(todo.id))}
        />
      </div>
      {editing && (
        <input
          ref={inputRef}
          className="edit"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
        />
      )}
    </li>
  );
};

export default TodoItem;