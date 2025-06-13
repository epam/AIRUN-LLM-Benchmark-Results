import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/store';
import { clearCompleted } from '../store/todoSlice';
import { FilterType } from '../types/todo';

export const TodoFooter: React.FC = () => {
  const todos = useAppSelector(state => state.todos);
  const dispatch = useAppDispatch();
  const location = useLocation();
  
  const remainingCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - remainingCount;
  
  const handleClear = () => {
    dispatch(clearCompleted());
  };
  
  return (
    <footer className="footer" style={{ display: todos.length ? 'block' : 'none' }}>
      <span className="todo-count">
        <strong>{remainingCount}</strong> {remainingCount === 1 ? 'item left' : 'items left'}
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
        <button className="clear-completed" onClick={handleClear}>
          Clear completed
        </button>
      )}
    </footer>
  );
};
