import React from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { clearCompleted } from '../store/todoSlice';
import { Link, useLocation } from 'react-router-dom';

const TodoFooter: React.FC = () => {
  const todos = useAppSelector(state => state.todos.todos);
  const dispatch = useAppDispatch();
  const location = useLocation();

  const remainingCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - remainingCount;

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{remainingCount}</strong> {remainingCount === 1 ? 'item' : 'items'} left
      </span>
      <ul className="filters">
        <li>
          <Link className={location.pathname === '/' ? 'selected' : ''} to="/">All</Link>
        </li>
        <li>
          <Link className={location.pathname === '/active' ? 'selected' : ''} to="/active">Active</Link>
        </li>
        <li>
          <Link className={location.pathname === '/completed' ? 'selected' : ''} to="/completed">Completed</Link>
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

export default TodoFooter;
