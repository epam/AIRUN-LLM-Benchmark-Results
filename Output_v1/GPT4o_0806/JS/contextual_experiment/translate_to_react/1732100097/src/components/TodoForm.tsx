import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../store/todoSlice';

const TodoForm: React.FC = () => {
  const [newTodo, setNewTodo] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      dispatch(addTodo(newTodo.trim()));
      setNewTodo('');
    }
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        autoFocus
      />
    </form>
  );
};

export default TodoForm;