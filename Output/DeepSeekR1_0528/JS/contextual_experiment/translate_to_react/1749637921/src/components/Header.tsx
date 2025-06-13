import React, { useState } from 'react';
import { useAppDispatch } from '../store/store';
import { addTodo } from '../store/todoSlice';

export const Header: React.FC = () => {
  const [newTodo, setNewTodo] = useState('');
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      dispatch(addTodo(newTodo));
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
