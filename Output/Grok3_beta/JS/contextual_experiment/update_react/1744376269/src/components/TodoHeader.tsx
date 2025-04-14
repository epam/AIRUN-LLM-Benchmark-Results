import React, { useState } from 'react';

import { ITodoHeaderProps } from '../types';
import { ENTER_KEY } from '../constants';

const TodoHeader: React.FC<ITodoHeaderProps> = ({ onAddTodo }) => {
  const [newTodo, setNewTodo] = useState('');

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();
    const val = newTodo.trim();
    if (val) {
      onAddTodo(val);
      setNewTodo('');
    }
  };

  return (
    <header className="header">
      <h1>todos</h1>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    </header>
  );
};

export default TodoHeader;