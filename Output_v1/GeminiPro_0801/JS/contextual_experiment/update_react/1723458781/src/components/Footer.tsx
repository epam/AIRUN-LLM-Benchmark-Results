import React from 'react';
import classNames from 'classnames';
import { VisibilityFilters } from '../store/todosSlice';
import { pluralize } from '../utils';
import { Link } from 'react-router-dom';

interface ITodoFooterProps {
  count: number;
  completedCount: number;
  onClearCompleted: () => void;
}

const TodoFooter: React.FC<ITodoFooterProps> = ({ count, completedCount, onClearCompleted }) => {
  const activeTodoWord = pluralize(count, 'item');

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{count}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        {[VisibilityFilters.SHOW_ALL, VisibilityFilters.SHOW_ACTIVE, VisibilityFilters.SHOW_COMPLETED].map(
          (filter) => (
            <li key={filter}>
              <Link
                to={filter === VisibilityFilters.SHOW_ALL ? '/' : `/${filter}`}
                className={classNames({ selected: filter === filter })}
              >
                {filter}
              </Link>
            </li>
          )
        )}
      </ul>
      {completedCount > 0 && (
        <button className="clear-completed" onClick={onClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default TodoFooter;
