import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { saveTodo } from '../store/todoSlice';
import { nanoid } from 'nanoid';

export const Header = () => {
  const dispatch = useDispatch();
  const [newTodo, setNewTodo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTodo.trim();
    
    if (title) {
      dispatch(saveTodo({
        title,
        id: nanoid(),
        completed: false,
        createdAt: Date.now()
      }));
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