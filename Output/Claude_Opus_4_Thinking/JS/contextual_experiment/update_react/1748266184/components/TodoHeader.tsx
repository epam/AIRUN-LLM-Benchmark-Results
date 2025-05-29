import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../store/todosSlice';
import { ENTER_KEY } from '../constants';

export const TodoHeader: React.FC = () => {
  const dispatch = useDispatch();
  const [newTodo, setNewTodo] = useState('');

  const handleNewTodoKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode !== ENTER_KEY) {
      return;
    }

    e.preventDefault();
    const val = newTodo.trim();

    if (val) {
      dispatch(addTodo(val));
      setNewTodo('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value);
  };

  return (
    <header className="header">
      <h1>todos</h1>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        value={newTodo}
        onChange={handleChange}
        onKeyDown={handleNewTodoKeyDown}
        autoFocus={true}
      />
    </header>
  );
};