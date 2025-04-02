import React, { useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { addTodo, markAll } from '../store/todoSlice';
import TodoList from './TodoList';
import TodoFooter from './TodoFooter';

const TodoApp: React.FC = () => {
  const [newTodo, setNewTodo] = useState('');
  const dispatch = useAppDispatch();

  const handleNewTodoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value);
  };

  const handleNewTodoKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTodo.trim()) {
      dispatch(addTodo(newTodo.trim()));
      setNewTodo('');
    }
  };

  const handleMarkAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(markAll(e.target.checked));
  };

  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={handleNewTodoChange}
          onKeyDown={handleNewTodoKeyDown}
          autoFocus
        />
      </header>
      <section className="main">
        <input id="toggle-all" className="toggle-all" type="checkbox" onChange={handleMarkAll} />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <TodoList />
      </section>
      <TodoFooter />
    </section>
  );
};

export default TodoApp;
