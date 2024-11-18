import React from 'react';
import classNames from 'classnames';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';
import { Utils } from '../utils/utils';

interface ITodoFooterProps {
  count: number;
  completedCount: number;
  nowShowing: string;
  onClearCompleted: () => void;
}

const TodoFooter: React.FC<ITodoFooterProps> = ({ count, completedCount, nowShowing, onClearCompleted }) => {
  const activeTodoWord = Utils.pluralize(count, 'item');
  const clearButton = completedCount > 0 && (
    <button className="clear-completed" onClick={onClearCompleted}>
      Clear completed
    </button>
  );

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{count}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <a href="#/" className={classNames({ selected: nowShowing === ALL_TODOS })}>All</a>
        </li>
        <li>
          <a href="#/active" className={classNames({ selected: nowShowing === ACTIVE_TODOS })}>Active</a>
        </li>
        <li>
          <a href="#/completed" className={classNames({ selected: nowShowing === COMPLETED_TODOS })}>Completed</a>
        </li>
      </ul>
      {clearButton}
    </footer>
  );
};

export { TodoFooter };