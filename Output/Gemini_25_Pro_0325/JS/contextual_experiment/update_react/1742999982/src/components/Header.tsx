import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../features/todos/todosSlice';
import { ENTER_KEY } from '../utils/constants';

const Header: React.FC = () => {
  const [text, setText] = useState('');
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const trimmedText = text.trim();
    if ((e.key === 'Enter' || e.keyCode === ENTER_KEY) && trimmedText) {
      dispatch(addTodo(trimmedText));
      setText('');
    }
  };

  return (
    <header className="header">
      <h1>todos</h1>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoFocus={true}
      />
    </header>
  );
};

export default Header;
