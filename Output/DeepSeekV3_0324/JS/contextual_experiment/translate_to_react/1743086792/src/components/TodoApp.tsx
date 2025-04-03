import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { addTodo, toggleAll } from '../store/todoSlice';
import TodoList from './TodoList';
import Footer from './Footer';

export const TodoApp: React.FC = () => {
  const [newTodo, setNewTodo] = useState('');
  const todos = useSelector((state: RootState) => state.todos);
  const dispatch = useDispatch();
  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTodo = newTodo.trim();
    if (trimmedTodo) {
      dispatch(addTodo(trimmedTodo));
      setNewTodo('');
    }
  };

  return (
    <div className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <form onSubmit={handleSubmit} className="todo-form">
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            autoFocus
          />
        </form>
      </header>
      {todos.length > 0 && (
        <>
          <section className="main">
            <input
              id="toggle-all"
              className="toggle-all"
              type="checkbox"
              checked={allCompleted}
              onChange={() => dispatch(toggleAll(!allCompleted))}
            />
            <label htmlFor="toggle-all">Mark all as complete</label>
            <TodoList />
          </section>
          <Footer />
        </>
      )}
    </div>
  );
};