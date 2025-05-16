import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { addTodo } from '../features/todos/todosSlice';
import { ENTER_KEY } from '../constants';

const TodoInput: React.FC = () => {
  const [newTodo, setNewTodo] = useState('');
  const dispatch: AppDispatch = useDispatch();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }
    event.preventDefault();
    const val = newTodo.trim();
    if (val) {
      dispatch(addTodo(val));
      setNewTodo('');
    }
  };

  return (
    <input
      className="new-todo"
      placeholder="What needs to be done?"
      value={newTodo}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      autoFocus={true}
    />
  );
};

export default TodoInput;