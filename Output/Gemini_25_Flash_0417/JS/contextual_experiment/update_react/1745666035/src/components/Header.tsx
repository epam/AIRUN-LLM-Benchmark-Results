import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../redux/todosSlice';
import { ENTER_KEY } from '../constants';

const Header: React.FC = () => {
  const [newTodo, setNewTodo] = useState('');
  const dispatch = useDispatch();

  const handleNewTodoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  };

  const handleNewTodoKeyDown = (event: React.KeyboardEvent) => {
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
    <header className="header">
      <h1>todos</h1>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        value={newTodo}
        onKeyDown={handleNewTodoKeyDown}
        onChange={handleNewTodoChange}
        autoFocus={true}
      />
    </header>
  );
};

export default Header;
