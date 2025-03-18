import React from 'react';
import classNames from 'classnames';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';
import { Utils } from '../utils';

interface TodoFooterProps {
  count: number;
  completedCount: number;
  nowShowing: string;
  onClearCompleted: () => void;
  setNowShowing: (filter: string) => void;
}

const TodoFooter: React.FC<TodoFooterProps> = ({
  count,
  completedCount,
  nowShowing,
  onClearCompleted,
  setNowShowing
}) => {
  const activeTodoWord = Utils.pluralize(count, 'item');

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{count}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <button
            className={classNames({ selected: nowShowing === ALL_TODOS })}
            onClick={() => setNowShowing(ALL_TODOS)}
          >
            All
          </button>
        </li>
        <li>
          <button
            className={classNames({ selected: nowShowing === ACTIVE_TODOS })}
            onClick={() => setNowShowing(ACTIVE_TODOS)}
          >
            Active
          </button>
        </li>
        <li>
          <button
            className={classNames({ selected: nowShowing === COMPLETED_TODOS })}
            onClick={() => setNowShowing(COMPLETED_TODOS)}
          >
            Completed
          </button>
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