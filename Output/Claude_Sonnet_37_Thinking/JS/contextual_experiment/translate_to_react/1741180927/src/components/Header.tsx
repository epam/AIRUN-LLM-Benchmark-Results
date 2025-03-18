import React, { useState } from 'react';
import { useAppDispatch } from '../store';
import { addTodo } from '../store/todosSlice';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const [newTodo, setNewTodo] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = newTodo.trim();
    if (trimmedText) {
      dispatch(addTodo(trimmedText));
      setNewTodo('');
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value);
  };
  
  return (
    <header className="header">
      <h1>todos</h1>
      <form className="todo-form" onSubmit={handleSubmit}>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={handleChange}
          autoFocus
        />
      </form>
    </header>
  );
};

export default Header;
