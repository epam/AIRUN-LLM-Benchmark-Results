import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCompleted, selectTodos, selectStatus, selectRemainingCount } from '../features/todos/todoSlice';

const Footer: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector(selectTodos);
  const status = useSelector(selectStatus);
  const remaining = useSelector(selectRemainingCount);

  if (todos.length === 0) {
    return null;
  }

  const completed = todos.length - remaining;

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{remaining}</strong> {remaining === 1 ? 'item' : 'items'} left
      </span>
      <ul className="filters">
        <li>
          <a href="#/" className={status === 'all' ? 'selected' : ''}>
            All
          </a>
        </li>
        <li>
          <a href="#/active" className={status === 'active' ? 'selected' : ''}>
            Active
          </a>
        </li>
        <li>
          <a href="#/completed" className={status === 'completed' ? 'selected' : ''}>
            Completed
          </a>
        </li>
      </ul>
      {completed > 0 && (
        <button
          className="clear-completed"
          onClick={() => dispatch(clearCompleted())}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default Footer;