import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../store/todoSlice';
import { ENTER_KEY } from '../constants';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const [text, setText] = useState('');

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.keyCode !== ENTER_KEY) return;

    const val = text.trim();
    if (val) {
      dispatch(addTodo(val));
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
        onChange={e => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    </header>
  );
};

export default Header;
