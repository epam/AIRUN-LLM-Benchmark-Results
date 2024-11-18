import React from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/reduxHooks';
import { clearCompleted } from '../store/todoSlice';
import { Link, useLocation } from 'react-router-dom';

const Footer: React.FC = () => {
  const todos = useAppSelector((state) => state.todos.todos);
  const dispatch = useAppDispatch();
  const location = useLocation();

  const remainingCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.length - remainingCount;

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{remainingCount}</strong> {remainingCount === 1 ? 'item' : 'items'} left
      </span>
      <ul className="filters">
        <li>
          <Link to="/" className={location.pathname === '/' ? 'selected' : ''}>
            All
          </Link>
        </li>
        <li>
          <Link to="/active" className={location.pathname === '/active' ? 'selected' : ''}>
            Active
          </Link>
        </li>
        <li>
          <Link to="/completed" className={location.pathname === '/completed' ? 'selected' : ''}>
            Completed
          </Link>
        </li>
      </ul>
      {completedCount > 0 && (
        <button className="clear-completed" onClick={handleClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default Footer;