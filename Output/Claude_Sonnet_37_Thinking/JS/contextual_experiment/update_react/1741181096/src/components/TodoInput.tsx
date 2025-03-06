import React, { useRef, KeyboardEvent } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../store/todoSlice';
import { ENTER_KEY } from '../constants';

const TodoInput: React.FC = () => {
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    const value = inputRef.current?.value.trim() || '';

    if (value) {
      dispatch(addTodo(value));
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  return (
    <input
      ref={inputRef}
      className="new-todo"
      placeholder="What needs to be done?"
      onKeyDown={handleKeyDown}
      autoFocus
    />
  );
};

export default TodoInput;