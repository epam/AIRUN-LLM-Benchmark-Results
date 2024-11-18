import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { clearCompleted } from '../store/todosSlice';
import { Link, useLocation } from 'react-router-dom';

const Footer: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const remainingCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - remainingCount;

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
      {completedCount > 0 && (
        <button className="clear-completed" onClick={() => dispatch(clearCompleted())}>
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default Footer;
