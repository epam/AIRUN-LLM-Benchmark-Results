import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch } from '../../store';
import { toggleTodo, removeTodo, editTodo } from './todosSlice';

interface TodoItemProps {
  todo: { id: string; title: string; completed: boolean };
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const handleEdit = () => setEditing(true);

  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    if (trimmedTitle) {
      dispatch(editTodo({ id: todo.id, title: trimmedTitle }));
    } else {
      dispatch(removeTodo(todo.id));
    }
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setTitle(todo.title);
      setEditing(false);
    } else if (e.key === 'Enter') {
      handleSubmit();
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
        <label onDoubleClick={handleEdit}>{todo.title}</label>
        <button className="destroy" onClick={() => dispatch(removeTodo(todo.id))} />
      </div>
      {editing && (
        <input
          ref={inputRef}
          className="edit"
          value={title}
          onBlur={handleSubmit}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      )}
    </li>
  );
};

export default TodoItem;