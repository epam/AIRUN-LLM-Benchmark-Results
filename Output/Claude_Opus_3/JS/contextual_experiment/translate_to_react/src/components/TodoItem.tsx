import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { removeTodo, updateTodo } from '../store/todoSlice';

interface TodoItemProps {
  todo: {
    id: string;
    title: string;
    completed: boolean;
  };
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const dispatch = useDispatch();

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleSave = () => {
    if (editedTitle.trim().length === 0) {
      dispatch(removeTodo(todo.id));
    } else {
      dispatch(updateTodo({ id: todo.id, title: editedTitle }));
    }
    setEditing(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSave();
    } else if (event.key === 'Escape') {
      setEditedTitle(todo.title);
      setEditing(false);
    }
  };

  return (
    <li className={`${todo.completed ? 'completed' : ''} ${editing ? 'editing' : ''}`}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={() => dispatch(updateTodo({ id: todo.id, completed: !todo.completed }))}
        />
        <label onDoubleClick={handleDoubleClick}>{todo.title}</label>
        <button className="destroy" onClick={() => dispatch(removeTodo(todo.id))}></button>
      </div>
      {editing && (
        <input
          className="edit"
          value={editedTitle}
          onChange={handleChange}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      )}
    </li>
  );
};

export default TodoItem;
