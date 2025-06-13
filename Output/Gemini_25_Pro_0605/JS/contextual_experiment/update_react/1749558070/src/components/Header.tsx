import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../store/todosSlice';
import { ENTER_KEY } from '../constants';

const Header: React.FC = () => {
  const [newTodo, setNewTodo] = useState('');
  const dispatch = useDispatch();

  const handleNewTodoKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== ENTER_KEY) {
      return;
    }

    const title = newTodo.trim();
    if (title) {
      dispatch(addTodo(title));
      setNewTodo('');
    }
  };

  const handleNewTodoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  };

  return (
    <header className="header">
      <h1>todos</h1>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        value={newTodo}
        onKeyDown={handleNewTodoKeyDown}
        onChange={handleNewTodoChange}
        autoFocus
      />
    </header>
  );
};

export default Header;
