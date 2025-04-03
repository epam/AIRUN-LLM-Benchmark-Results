import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { clearCompleted } from '../store/todoSlice';
import { Link, useLocation } from 'react-router-dom';

export const Footer: React.FC = () => {
  const todos = useSelector((state: RootState) => state.todos);
  const remainingCount = todos.filter(todo => !todo.completed).length;
  const location = useLocation();
  const dispatch = useDispatch();

  if (todos.length === 0) return null;

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{remainingCount}</strong> {remainingCount === 1 ? 'item' : 'items'} left
      </span>
      <ul className="filters">
        <li>
          <Link to="/" className={location.pathname === '/' ? 'selected' : ''}>All</Link>
        </li>
        <li>
          <Link to="/active" className={location.pathname === '/active' ? 'selected' : ''}>Active</Link>
        </li>
        <li>
          <Link to="/completed" className={location.pathname === '/completed' ? 'selected' : ''}>Completed</Link>
        </li>
      </ul>
      {remainingCount < todos.length && (
        <button className="clear-completed" onClick={() => dispatch(clearCompleted())}>
          Clear completed
        </button>
      )}
    </footer>
  );
};