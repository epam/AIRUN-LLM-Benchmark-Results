import React, { useState, FormEvent } from 'react';
import { useAppDispatch } from '../../store';
import { addTodo } from './todosSlice';

const TodoInput: React.FC = () => {
  const [title, setTitle] = useState('');
  const dispatch = useAppDispatch();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (trimmedTitle) {
      dispatch(addTodo(trimmedTitle));
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </form>
  );
};

export default TodoInput;