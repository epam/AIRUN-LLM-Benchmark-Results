import React from 'react';
import { useDispatch } from 'react-redux';
import { removeTodo, toggleTodo } from '../store/todoSlice';

interface Props {
  id: string;
  title: string;
  completed: boolean;
}

function TodoItem({ id, title, completed }: Props) {
  const dispatch = useDispatch();

  const handleToggle = () => {
    dispatch(toggleTodo(id));
  };

  const handleRemove = () => {
    dispatch(removeTodo(id));
  };

  return (
    <li>
      <input type='checkbox' checked={completed} onChange={handleToggle} />
      <span style={{ textDecoration: completed ? 'line-through' : 'none' }}>{title}</span>
      <button onClick={handleRemove}>Remove</button>
    </li>
  );
}

export default TodoItem;