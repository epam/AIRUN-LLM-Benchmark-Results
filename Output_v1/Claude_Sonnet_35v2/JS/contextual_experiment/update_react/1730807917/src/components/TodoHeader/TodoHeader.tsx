import React, { useState, KeyboardEvent } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../../store/todoSlice';
import { KEYS } from '../../constants/constants';

const TodoHeader: React.FC = () => {
  const dispatch = useDispatch();
  const [newTodo, setNewTodo] = useState('');

  const handleNewTodoKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode !== KEYS.ENTER) {
      return;
    }

    event.preventDefault();
    const trimmedText = newTodo.trim();

    if (trimmedText) {
      dispatch(addTodo(trimmedText));
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
        onChange={(e) => setNewTodo(e.target.value)}
        onKeyDown={handleNewTodoKeyDown}
        autoFocus
      />
    </header>
  );
};

export default TodoHeader;