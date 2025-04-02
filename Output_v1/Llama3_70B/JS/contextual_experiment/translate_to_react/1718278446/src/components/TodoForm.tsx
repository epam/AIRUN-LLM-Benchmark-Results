import React, { useState } from 'react';
import { addTodo } from '../redux/todosSlice';
import { useDispatch } from 'react-redux';

const TodoForm: React.FC = () => {
  const dispatch = useDispatch();
  const [newTodo, setNewTodo] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(addTodo({ title: newTodo, completed: false }));
    setNewTodo('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setNewTodo(e.target.value);

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={newTodo} onChange={handleInputChange} />
      <button type="submit">Add Todo</button>
    </form>
  );
};

export default TodoForm;
