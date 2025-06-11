import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import { RootState, AppDispatch } from '../store';
import { clearCompletedTodos } from '../features/todos/todosSlice';
import { Todo } from '../features/todos/types';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, FilterType } from '../constants';
import { pluralize } from '../utils/pluralize';

interface FooterProps {
  nowShowing: FilterType;
}

const Footer: React.FC<FooterProps> = ({ nowShowing }) => {
  const dispatch: AppDispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);

  const activeTodoCount = todos.reduce((count, todo) => (todo.completed ? count : count + 1), 0);
  const completedCount = todos.length - activeTodoCount;

  const handleClearCompleted = () => {
    dispatch(clearCompletedTodos());
  };

  const activeTodoWord = pluralize(activeTodoCount, 'item');

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeTodoCount}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <Link to="/" className={classNames({ selected: nowShowing === ALL_TODOS })}>
            All
          </Link>
        </li>{' '}
        <li>
          <Link to="/active" className={classNames({ selected: nowShowing === ACTIVE_TODOS })}>
            Active
          </Link>
        </li>{' '}
        <li>
          <Link to="/completed" className={classNames({ selected: nowShowing === COMPLETED_TODOS })}>
            Completed
          </Link>
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