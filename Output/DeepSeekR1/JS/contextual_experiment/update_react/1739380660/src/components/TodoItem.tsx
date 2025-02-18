import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Todo } from '../types';
import { toggleTodo, deleteTodo, updateTodo } from '../features/todos/todosSlice';

export const TodoItem = ({ todo }: { todo: Todo }) => {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const handleToggle = () => {
    dispatch(toggleTodo(todo.id));
  };

  const handleDestroy = () => {
    dispatch(deleteTodo(todo.id));
  };

  const handleEdit = () => {
    setEditText(todo.title);
    setEditing(true);
  };

  const handleSave = () => {
    const text = editText.trim();
    if (text) {
      dispatch(updateTodo({ id: todo.id, changes: { title: text } }));
    } else {
      handleDestroy();
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
    setEditText(todo.title);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <li className={`${todo.completed ? 'completed' : ''} ${editing ? 'editing' : ''}`}>
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
          ref={inputRef}
          className="edit"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
        />
      )}
    </li>
  );
};