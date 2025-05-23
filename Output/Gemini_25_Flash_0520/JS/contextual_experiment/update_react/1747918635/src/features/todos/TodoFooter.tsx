```typescript
import classNames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../../constants';
import { pluralize } from '../../utils/helpers';
import { ITodoFooterProps } from '../../types';

export const TodoFooter: React.FC<ITodoFooterProps> = ({
  count,
  completedCount,
  nowShowing,
  onClearCompleted,
}) => {
  const activeTodoWord = pluralize(count, 'item');
  let clearButton = null;

  if (completedCount > 0) {
    clearButton = (
      <button className="clear-completed" onClick={onClearCompleted}>
        Clear completed
      </button>
    );
  }

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{count}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <Link
            to="/"
            className={classNames({ selected: nowShowing === ALL_TODOS })}
          >
            All
          </Link>
        </li>
        {' '}
        <li>
          <Link
            to="/active"
            className={classNames({ selected: nowShowing === ACTIVE_TODOS })}
          >
            Active
          </Link>
        </li>
        {' '}
        <li>
          <Link
            to="/completed"
            className={classNames({ selected: nowShowing === COMPLETED_TODOS })}
          >
            Completed
          </Link>
        </li>
      </ul>
      {clearButton}
    </footer>
  );
};
```