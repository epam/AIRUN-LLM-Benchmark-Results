import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';
import { clearCompleted, selectActiveCount, selectCompletedCount, selectFilter } from '../features/todos/todosSlice';

const pluralize = (count: number, word: string) => (count === 1 ? word : `${word}s`);

const TodoFooter: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeCount = useAppSelector(selectActiveCount);
  const completedCount = useAppSelector(selectCompletedCount);
  const filter = useAppSelector(selectFilter);

  if (activeCount === 0 && completedCount === 0) return null;

  const activeTodoWord = pluralize(activeCount, 'item');

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeCount}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <Link to="/" className={classNames({ selected: filter === ALL_TODOS })}>
            All
          </Link>
        </li>{' '}
        <li>
          <Link to="/active" className={classNames({ selected: filter === ACTIVE_TODOS })}>
            Active
          </Link>
        </li>{' '}
        <li>
          <Link to="/completed" className={classNames({ selected: filter === COMPLETED_TODOS })}>
            Completed
          </Link>
        </li>
      </ul>
      {completedCount > 0 && (
        <button className="clear-completed" onClick={() => dispatch(clearCompleted())}>
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default TodoFooter;
