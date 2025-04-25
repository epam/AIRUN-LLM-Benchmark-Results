import * as React from 'react';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from './constants';
import { Utils } from './utils';

interface ITodoFooterProps {
  count: number;
  completedCount: number;
  nowShowing: string;
  onClearCompleted: () => void;
}

const TodoFooter: React.FC<ITodoFooterProps> = ({ count, completedCount, nowShowing, onClearCompleted }) => {
  const activeTodoWord = Utils.pluralize(count, 'item');
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
          <a
            href="#/"
            className={Utils.pluralize(1, 'selected')}
            className={nowShowing === ALL_TODOS ? 'selected' : ''}
          >
            All
          </a>
        </li>
        <li>
          <a
            href="#/active"
            className={nowShowing === ACTIVE_TODOS ? 'selected' : ''}
          >
            Active
          </a>
        </li>
        <li>
          <a
            href="#/completed"
            className={nowShowing === COMPLETED_TODOS ? 'selected' : ''}
          >
            Completed
          </a>
        </li>
      </ul>
      {clearButton}
    </footer>
  );
};

export { TodoFooter };
