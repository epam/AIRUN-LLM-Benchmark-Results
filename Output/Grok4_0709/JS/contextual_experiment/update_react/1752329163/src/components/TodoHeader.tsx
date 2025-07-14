import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { addTodo } from '../store/todosSlice';

const TodoHeader: React.FC = () => {
  const [newTodo, setNewTodo] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = newTodo.trim();
      if (val) {
        dispatch(addTodo(val));
        setNewTodo('');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value);
  };

  return (
    <header className="header">
      <h1>todos</h1>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        value={newTodo}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    </header>
  );
};

export default TodoHeader;