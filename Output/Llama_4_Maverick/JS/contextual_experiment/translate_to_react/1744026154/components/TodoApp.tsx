import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo, markAll } from '../store/todoSlice';
import TodoList from './TodoList';
import TodoFooter from './TodoFooter';

const TodoApp: React.FC = () => {
  const dispatch = useDispatch();
  const [newTodo, setNewTodo] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newTodo.trim()) {
      dispatch(addTodo(newTodo));
      setNewTodo('');
    }
  };

  return (
    <>
      <header className="header">
        <h1>todos</h1>
        <form onSubmit={handleSubmit}>
          <input
            className="new-todo"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done?"
            autoFocus
          />
        </form>
      </header>
      <section className="main">
        <input
          id="toggle-all"
          className="toggle-all"
          type="checkbox"
          onChange={(e) => dispatch(markAll(e.target.checked))}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <TodoList />
      </section>
      <TodoFooter />
    </>
  );
};

export default TodoApp;