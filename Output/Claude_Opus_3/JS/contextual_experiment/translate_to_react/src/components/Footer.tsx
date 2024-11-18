import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const todos = useSelector((state: RootState) => state.todos);
  const remainingCount = todos.filter((todo) => !todo.completed).length;

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{remainingCount}</strong>
        <span> {remainingCount === 1 ? 'item' : 'items'} left</span>
      </span>
      <ul className="filters">
        <li>
          <Link to="/" className={window.location.hash === '#/' ? 'selected' : ''}>
            All
          </Link>
        </li>
        <li>
          <Link to="/active" className={window.location.hash === '#/active' ? 'selected' : ''}>
            Active
          </Link>
        </li>
        <li>
          <Link to="/completed" className={window.location.hash === '#/completed' ? 'selected' : ''}>
            Completed
          </Link>
        </li>
      </ul>
      {remainingCount < todos.length && (
        <button className="clear-completed" onClick={() => {}}>
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default Footer;
