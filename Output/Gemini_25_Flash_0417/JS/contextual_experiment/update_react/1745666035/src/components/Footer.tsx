import React from 'react';
import classNames from 'classnames';
import { TodoFilter, ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';
import { pluralize } from '../utils';
import { useDispatch } from 'react-redux';
import { clearCompletedTodos } from '../redux/todosSlice';

interface FooterProps {
  count: number;
  completedCount: number;
  nowShowing: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
}

const Footer: React.FC<FooterProps> = ({ count, completedCount, nowShowing, onFilterChange }) => {
  const dispatch = useDispatch();
  const activeTodoWord = pluralize(count, 'item');

  const handleClearCompleted = () => {
    dispatch(clearCompletedTodos());
  };

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{count}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <a
            href="#/"
            className={classNames({ selected: nowShowing === ALL_TODOS })}
            onClick={() => onFilterChange(ALL_TODOS)}
          >
            All
          </a>
        </li>
        {' '}
        <li>
          <a
            href="#/active"
            className={classNames({ selected: nowShowing === ACTIVE_TODOS })}
            onClick={() => onFilterChange(ACTIVE_TODOS)}
          >
            Active
          </a>
        </li>
        {' '}
        <li>
          <a
            href="#/completed"
            className={classNames({ selected: nowShowing === COMPLETED_TODOS })}
            onClick={() => onFilterChange(COMPLETED_TODOS)}
          >
            Completed
          </a>
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
