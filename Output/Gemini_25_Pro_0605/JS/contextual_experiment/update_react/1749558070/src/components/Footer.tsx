import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import classNames from 'classnames';

import { RootState } from '../store/store';
import { clearCompleted } from '../store/todosSlice';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';

const pluralize = (count: number, word: string) => (count === 1 ? word : word + 's');

const Footer: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos);
  const location = useLocation();

  const activeTodoCount = todos.reduce((count, todo) => (todo.completed ? count : count + 1), 0);
  const completedCount = todos.length - activeTodoCount;

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  if (todos.length === 0) {
    return null;
  }

  const nowShowing = location.pathname === '/active' ? ACTIVE_TODOS : location.pathname === '/completed' ? COMPLETED_TODOS : ALL_TODOS;

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeTodoCount}</strong> {pluralize(activeTodoCount, 'item')} left
      </span>
      <ul className="filters">
        <li>
          <NavLink to="/" className={classNames({ selected: nowShowing === ALL_TODOS })}>
            All
          </NavLink>
        </li>
        <li>
          <NavLink to="/active" className={classNames({ selected: nowShowing === ACTIVE_TODOS })}>
            Active
          </NavLink>
        </li>
        <li>
          <NavLink to="/completed" className={classNames({ selected: nowShowing === COMPLETED_TODOS })}>
            Completed
          </NavLink>
        </li>
      </ul>
      {completedCount > 0 && (
        <button className="clear-completed" onClick={handleClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default Footer;
