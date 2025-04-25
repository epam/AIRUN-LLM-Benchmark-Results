import React from 'react';
import { classNames } from 'classnames';
import { ITodoFooterProps } from './types';

const TodoFooter: React.FC<ITodoFooterProps> = (props) => {
  const activeTodoWord = React.useMemo(() => {
    if (props.count === 1) {
      return 'item';
    } else {
      return 'items';
    }
  }, [props.count]);

  const clearButton = props.completedCount > 0 ? (
    <button
      className={classNames('clear-completed')}
      onClick={props.onClearCompleted}
    >
      Clear completed
    </button>
  ) : null;

  return (
    <footer className={classNames('footer')}>
      <span className="todo-count">
        <strong>{props.count}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <a
            href="#/"
            className={classNames({ selected: props.nowShowing === ALL_TODOS })}
          >
            All
          </a>
        </li>
        <li>
          <a
            href="#/active"
            className={classNames({ selected: props.nowShowing === ACTIVE_TODOS })}
          >
            Active
          </a>
        </li>
        <li>
          <a
            href="#/completed"
            className={classNames({ selected: props.nowShowing === COMPLETED_TODOS })}
          >
            Completed
          </a>
        </li>
      </ul>
      {clearButton}
    </footer>
  );
};

export default TodoFooter;