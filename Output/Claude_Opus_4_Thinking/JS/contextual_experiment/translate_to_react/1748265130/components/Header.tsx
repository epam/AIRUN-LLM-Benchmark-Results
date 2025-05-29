import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../store/todoSlice';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const dispatch = useDispatch();
  const [newTodo, setNewTodo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTodo = newTodo.trim();
    if (trimmedTodo.length > 0) {
      dispatch(addTodo(trimmedTodo));
      setNewTodo('');
    }
  };

  return (
    <header className="header">
      <h1>todos</h1>
      <form className="todo-form" onSubmit={handleSubmit}>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          autoFocus
        />
      </form>
    </header>
  );
};

export default Header;