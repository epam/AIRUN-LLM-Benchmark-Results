import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Filter } from './types';

interface TodoFooterProps {
  count: number;
  completedCount: number;
  filter: Filter;
  onClearCompleted: () => void;
}

const FILTER_LABELS: Record<Filter, string> = {
  all: 'All',
  active: 'Active',
  completed: 'Completed',
};

export const TodoFooter: React.FC<TodoFooterProps> = ({
  count,
  completedCount,
  filter,
  onClearCompleted,
}) => {
  const itemWord = count === 1 ? 'item' : 'items';

  return (
    <footer className='footer'>
      <span className='todo-count'>
        <strong>{count}</strong> {itemWord} left
      </span>
      <ul className='filters'>
        {Object.entries(FILTER_LABELS).map(([key, label]) => {
          const value = key as Filter;
          return (
            <li key={value}>
              <Link
                to={value === 'all' ? '/' : `/${value}`}
                className={classNames({ selected: filter === value })}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
      {completedCount > 0 && (
        <button
          className='clear-completed'
          onClick={onClearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};