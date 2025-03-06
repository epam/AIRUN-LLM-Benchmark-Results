import React, { useState, KeyboardEvent } from 'react';
import { useAppDispatch } from '../store';
import { addTodo } from '../store/todoSlice';
import { ENTER_KEY } from '../constants';

const TodoInput: React.FC = () => {
  const [newTodo, setNewTodo] = useState('');
  const dispatch = useAppDispatch();

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();
    const text = newTodo.trim();

    if (text) {
      dispatch(addTodo(text));
      setNewTodo('');
    }
  };

  return (
    <input
      className="new-todo"
      placeholder="What needs to be done?"
      value={newTodo}
      onChange={(e) => setNewTodo(e.target.value)}
      onKeyDown={handleKeyDown}
      autoFocus
    />
  );
};

export default TodoInput;