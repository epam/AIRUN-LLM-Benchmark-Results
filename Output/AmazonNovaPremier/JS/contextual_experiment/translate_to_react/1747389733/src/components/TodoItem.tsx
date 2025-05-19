import { useState, useRef, useEffect } from 'react';
import { useAppDispatch } from '../app/hooks';
import { Todo } from '../app/types';
import { removeTodo, updateTodo, toggleTodo } from '../app/todoSlice';
import { useEscapeKey } from '../hooks/useEscapeKey';

type TodoItemProps = {
  todo: Todo;
};

const TodoItem = ({ todo }: TodoItemProps) => {
  const [isEditing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) inputRef.current.focus();
  }, [isEditing]);

  useEscapeKey(() => handleCancelEdit());

  const handleToggle = () => dispatch(toggleTodo(todo.id));
  const handleEdit = () => setEditing(true);
  const handleSaveEdit = () => {
    if (editText.trim()) dispatch(updateTodo({ id: todo.id, changes: { title: editText.trim() } }));
    setEditing(false);
  };
  const handleCancelEdit = () => {
    setEditText(todo.title);
    setEditing(false);
  };

  return (
    <li className={`${todo.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`}>
      <div className="view">
        <input className="toggle" type="checkbox" checked={todo.completed} onChange={handleToggle} />
        <label onDoubleClick={handleEdit}>{todo.title}</label>
        <button className="destroy" onClick={() => dispatch(removeTodo(todo.id))} />
      </div>
      <input
        ref={inputRef}
        className="edit"
        value={editText}
        onChange={e => setEditText(e.target.value)}
        onBlur={handleSaveEdit}
        onKeyDown={e => e.key === 'Enter' && handleSaveEdit()}
      />
    </li>
  );
};

export default TodoItem;