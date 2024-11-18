import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggle, destroy, save } from './TodoModel';

const TodoItem = ({ todo }) => {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(save({ id: todo.id, title: editText }));
    setEditing(false);
  };

  const handleEdit = () => {
    setEditing(true);
    setEditText(todo.title);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setEditing(false);
      setEditText(todo.title);
    } else if (event.key === 'Enter') {
      handleSubmit(event);
    }
  };

  const handleChange = (event) => {
    setEditText(event.target.value);
  };

  return (
    <li className={`${todo.completed ? 'completed' : ''} ${editing ? 'editing' : ''}`}> 
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={() => dispatch(toggle(todo.id))}
        />
        <label onDoubleClick={handleEdit}>{todo.title}</label>
        <button className="destroy" onClick={() => dispatch(destroy(todo.id))} />
      </div>
      {editing && (
        <input
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

export default TodoItem;