import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TodoFooterProps } from '../types';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';
import { pluralize } from '../utils';

export const TodoFooter: React.FC<TodoFooterProps> = ({
  count,
  completedCount,
  filter,
  onClearCompleted
}) => {
  const location = useLocation();
  const activeTodoWord = pluralize(count, 'item');

  const clearButton = completedCount > 0 ? (
    <button
      className="clear-completed"
      onClick={onClearCompleted}
    >
      Clear completed
    </button>
  ) : null;

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{count}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <Link
            to="/"
            className={filter === ALL_TODOS ? 'selected' : ''}
          >
            All
          </Link>
        </li>
        {' '}
        <li>
          <Link
            to="/active"
            className={filter === ACTIVE_TODOS ? 'selected' : ''}
          >
            Active
          </Link>
        </li>
        {' '}
        <li>
          <Link
            to="/completed"
            className={filter === COMPLETED_TODOS ? 'selected' : ''}
          >
            Completed
          </Link>
        </li>
      </ul>
      {clearButton}
    </footer>
  );
};