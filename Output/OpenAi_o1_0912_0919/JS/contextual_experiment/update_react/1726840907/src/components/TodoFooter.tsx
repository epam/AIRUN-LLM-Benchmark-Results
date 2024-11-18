import React from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { clearCompleted } from '../store/todosSlice';
import { pluralize } from '../utils';
import { TodoFilters } from '../constants';

const TodoFooter: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos);
  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.length - activeCount;
  const activeTodoWord = pluralize(activeCount, 'item');
  const nowShowing = window.location.hash.replace('#/', '') || TodoFilters.All;

  const clearButton = completedCount > 0 ? (
    <button className="clear-completed" onClick={() => dispatch(clearCompleted())}>
      Clear completed
    </button>
  ) : null;

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeCount}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <a
            href="#/"
            className={classNames({ selected: nowShowing === TodoFilters.All })}
          >
            All
          </a>
        </li>
        {' '}
        <li>
          <a
            href="#/active"
            className={classNames({ selected: nowShowing === TodoFilters.Active })}
          >
            Active
          </a>
        </li>
        {' '}
        <li>
          <a
            href="#/completed"
            className={classNames({ selected: nowShowing === TodoFilters.Completed })}
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