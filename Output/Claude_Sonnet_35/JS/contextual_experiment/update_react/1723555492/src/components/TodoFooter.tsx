import React from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';
import { pluralize } from '../utils/utils';
import { clearCompleted, setFilter } from '../features/todoSlice';
import { TodoFooterProps } from '../types';

const TodoFooter: React.FC<TodoFooterProps> = ({ activeCount, completedCount, filter }) => {
  const dispatch = useDispatch();

  const activeTodoWord = pluralize(activeCount, 'item');

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeCount}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <a
            href="#/"
            className={classNames({ selected: filter === ALL_TODOS })}
            onClick={() => dispatch(setFilter(ALL_TODOS))}
          >
            All
          </a>
        </li>
        {' '}
        <li>
          <a
            href="#/active"
            className={classNames({ selected: filter === ACTIVE_TODOS })}
            onClick={() => dispatch(setFilter(ACTIVE_TODOS))}
          >
            Active
          </a>
        </li>
        {' '}
        <li>
          <a
            href="#/completed"
            className={classNames({ selected: filter === COMPLETED_TODOS })}
            onClick={() => dispatch(setFilter(COMPLETED_TODOS))}
          >
            Completed
          </a>
        </li>
      </ul>
      {completedCount > 0 && (
        <button
          className="clear-completed"
          onClick={() => dispatch(clearCompleted())}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default TodoFooter;
