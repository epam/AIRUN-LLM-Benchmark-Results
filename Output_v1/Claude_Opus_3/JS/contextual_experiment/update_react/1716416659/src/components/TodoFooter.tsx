import React from 'react';
import classNames from 'classnames';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../utils/constants';
import { pluralize } from '../utils/utils';

interface TodoFooterProps {
  activeTodoCount: number;
  completedTodoCount: number;
  nowShowing: string;
  onClearCompleted: () => void;
  onFilterChange: (filter: string) => void;
}

const TodoFooter: React.FC<TodoFooterProps> = ({
  activeTodoCount,
  completedTodoCount,
  nowShowing,
  onClearCompleted,
  onFilterChange,
}) => {
  const activeTodoWord = pluralize(activeTodoCount, 'item');

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeTodoCount}</strong> {activeTodoWord} left
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
        <li>
          <a
            href="#/active"
            className={classNames({ selected: nowShowing === ACTIVE_TODOS })}
            onClick={() => onFilterChange(ACTIVE_TODOS)}
          >
            Active
          </a>
        </li>
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
      {completedTodoCount > 0 && (
        <button className="clear-completed" onClick={onClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default TodoFooter;
