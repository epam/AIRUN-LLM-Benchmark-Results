import * as React from 'react';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from './constants';
import { pluralize } from './utils';

interface ITodoFooterProps {
  count: number;
  completedCount: number;
  nowShowing: string;
  onClearCompleted: () => void;
}

const TodoFooter: React.FC<ITodoFooterProps> = ({
  count,
  completedCount,
  nowShowing,
  onClearCompleted,
}) => {
  const activeTodoWord = pluralize(count, 'item');

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{count}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <a
            href="#/"
            className={nowShowing === ALL_TODOS ? 'selected' : ''}
          >
            All
          </a>
        </li>
        {' '}
        <li>
          <a
            href="#/active"
            className={nowShowing === ACTIVE_TODOS ? 'selected' : ''}
          >
            Active
          </a>
        </li>
        {' '}
        <li>
          <a
            href="#/completed"
            className={nowShowing === COMPLETED_TODOS ? 'selected' : ''}
          >
            Completed
          </a>
        </li>
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