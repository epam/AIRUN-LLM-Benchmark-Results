import React, { useState } from 'react';
import { useAppDispatch } from '../hooks/reduxHooks';
import { addTodo } from '../store/todoSlice';

const Header: React.FC = () => {
  const [newTodo, setNewTodo] = useState('');
  const dispatch = useAppDispatch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      dispatch(addTodo(newTodo.trim()));
      setNewTodo('');
    }
  };

  return (
    <header className="header">
      <h1>todos</h1>
      <form onSubmit={handleFormSubmit}>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={handleInputChange}
          autoFocus
        />
      </form>
    </header>
  );
};

export default Header;