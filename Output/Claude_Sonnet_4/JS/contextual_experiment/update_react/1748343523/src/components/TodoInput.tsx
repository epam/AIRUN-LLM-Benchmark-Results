import React, { useState, KeyboardEvent } from 'react';
import { TodoInputProps } from '../types';
import { ENTER_KEY } from '../constants';

export const TodoInput: React.FC<TodoInputProps> = ({ onAddTodo }) => {
  const [value, setValue] = useState('');

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    const val = value.trim();

    if (val) {
      onAddTodo(val);
      setValue('');
    }
  };

  return (
    <input
      className="new-todo"
      placeholder="What needs to be done?"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      autoFocus
    />
  );
};