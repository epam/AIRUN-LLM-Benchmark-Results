import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../todosSlice';

const AddTodo: React.FC = () => {
  const [title, setTitle] = useState('');
  const dispatch = useDispatch();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && title.trim() !== '') {
      dispatch(addTodo(title.trim()));
      setTitle('');
    }
  };

  return (
    <header className="header">
      <h1>todos</h1>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    </header>
  );
};

export default AddTodo;
