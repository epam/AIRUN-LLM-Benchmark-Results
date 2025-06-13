import React, { FC, useState, ChangeEvent, KeyboardEvent } from 'react';

interface TodoInputProps {
  onAdd: (title: string) => void;
}

export const TodoInput: FC<TodoInputProps> = ({ onAdd }) => {
  const [text, setText] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = text.trim();
      if (value) {
        onAdd(value);
        setText('');
      }
    }
  };

  return (
    <input
      className="new-todo"
      placeholder="What needs to be done?"
      value={text}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      autoFocus
    />
  );
};