import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateTodo, deleteTodo } from '../store/todoSlice';
import { Todo } from '../types/todo';
import { useTodoFocus } from '../hooks/useTodoFocus';
import { useKeyPress } from '../hooks/useKeyPress';

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);
  const [originalTitle, setOriginalTitle] = useState('');
  const dispatch = useDispatch();
  
  const editInputRef = useTodoFocus(editing);

  const handleEdit = () => {
    setEditing(true);
    setOriginalTitle(todo.title);
    setEditText(todo.title);
  };

  const handleSave = () => {
    const trimmedText = editText.trim();
    if (trimmedText.length === 0) {
      dispatch(deleteTodo(todo.id));
    } else {
      dispatch(updateTodo({ id: todo.id, title: trimmedText }));
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setEditText(originalTitle);
    setEditing(false);
  };

  const handleToggle = () => {
    dispatch(updateTodo({ id: todo.id, completed: !todo.completed }));
  };

  const handleDelete = () => {
    dispatch(deleteTodo(todo.id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  useKeyPress('Escape', handleCancel);

  const itemClass = `${todo.completed ? 'completed' : ''} ${editing ? 'editing' : ''}`;

  return (
    <li className={itemClass}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
        />
        <label onDoubleClick={handleEdit}>{todo.title}</label>
        <button className="destroy" onClick={handleDelete}></button>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <input
          ref={editInputRef}
          className="edit"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
        />
      </form>
    </li>
  );
};