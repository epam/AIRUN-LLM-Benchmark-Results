import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../todoSlice';
import { ENTER_KEY } from '../constants';

function TodoHeader() {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    const val = inputValue.trim();
    if (val) {
      dispatch(addTodo(val));
      setInputValue('');
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <header className="header">
      <h1>todos</h1>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    </header>
  );
}

export default TodoHeader;