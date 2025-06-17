import React, { useRef } from 'react';
import { useAppDispatch } from '../hooks';
import { add } from '../features/todos/todosSlice';
import { ENTER_KEY } from '../constants';

const TodoHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.keyCode !== ENTER_KEY) return;

    e.preventDefault();
    const value = inputRef.current?.value.trim() ?? '';

    if (value) {
      dispatch(add(value));
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <header className="header">
      <h1>todos</h1>
      <input
        ref={inputRef}
        className="new-todo"
        placeholder="What needs to be done?"
        onKeyDown={handleKeyDown}
        autoFocus
      />
    </header>
  );
};

export default TodoHeader;
