import React from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { clearCompleted, setFilter } from '../store/todoSlice';
import { FILTER_ALL, FILTER_ACTIVE, FILTER_COMPLETED } from '../constants';

const TodoFooter: React.FC = () => {
  const dispatch = useDispatch();
  const { todos, filter } = useSelector((state: RootState) => state.todos);

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.length - activeCount;
  const activeTodoWord = activeCount === 1 ? 'item' : 'items';

  if (todos.length === 0) {
    return null;
  }

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeCount}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <a
            href="#/"
            className={classNames({ selected: filter === FILTER_ALL })}
            onClick={e => {
              e.preventDefault();
              dispatch(setFilter(FILTER_ALL));
            }}
          >
            All
          </a>
        </li>{' '}
        <li>
          <a
            href="#/active"
            className={classNames({ selected: filter === FILTER_ACTIVE })}
            onClick={e => {
              e.preventDefault();
              dispatch(setFilter(FILTER_ACTIVE));
            }}
          >
            Active
          </a>
        </li>{' '}
        <li>
          <a
            href="#/completed"
            className={classNames({ selected: filter === FILTER_COMPLETED })}
            onClick={e => {
              e.preventDefault();
              dispatch(setFilter(FILTER_COMPLETED));
            }}
          >
            Completed
          </a>
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
