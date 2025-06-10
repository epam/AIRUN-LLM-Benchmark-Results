import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggle, destroy, save } from './todoSlice';
import { ITodo } from '../../models/todoModel';

interface TodoItemProps {
  todo: ITodo;
}

function TodoItem({ todo }: TodoItemProps) {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);

  const handleDoubleClick = () => {
    setEditing(true);
    setEditText(todo.title);
  };

  const handleSave = () => {
    dispatch(save({ id: todo.id, title: editText }));
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
    setEditText(todo.title);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <li className={`completed: ${todo.completed ? 'completed' : ''} editing: ${editing ? 'editing' : ''}`}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={() => dispatch(toggle(todo.id))}
        />
        <label onDoubleClick={handleDoubleClick}>
          {todo.title}
        </label>
        <button className="destroy" onClick={() => dispatch(destroy(todo.id))} />
      </div>
      {editing && (
        <input
          className="edit"
          value={editText}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
        />
      )}
    </li>
  );
}

export default TodoItem;