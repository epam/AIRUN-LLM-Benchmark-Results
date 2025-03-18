import React, { useState } from 'react';
import { useAppDispatch } from '../store/store';
import { addTodo } from '../store/todoSlice';

const TodoInput: React.FC = () => {
  const dispatch = useAppDispatch();
  const [newTodo, setNewTodo] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (newTodo.trim()) {
      dispatch(addTodo(newTodo));
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

export default TodoInput;