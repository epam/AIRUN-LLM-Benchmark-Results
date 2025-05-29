import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { RootState } from '../store/store';
import { clearCompleted } from '../store/todosSlice';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';
import { pluralize } from '../utils';

export const TodoFooter: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const todos = useSelector((state: RootState) => state.todos.items);
  
  const activeTodoCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeTodoCount;
  
  if (todos.length === 0) {
    return null;
  }

  const activeTodoWord = pluralize(activeTodoCount, 'item');
  
  const nowShowing = location.pathname === '/active' ? ACTIVE_TODOS :
                     location.pathname === '/completed' ? COMPLETED_TODOS :
                     ALL_TODOS;

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeTodoCount}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <Link
            to="/"
            className={nowShowing === ALL_TODOS ? 'selected' : ''}>
            All
          </Link>
        </li>
        {' '}
        <li>
          <Link
            to="/active"
            className={nowShowing === ACTIVE_TODOS ? 'selected' : ''}>
            Active
          </Link>
        </li>
        {' '}
        <li>
          <Link
            to="/completed"
            className={nowShowing === COMPLETED_TODOS ? 'selected' : ''}>
            Completed
          </Link>
        </li>
      </ul>
      {completedCount > 0 && (
        <button
          className="clear-completed"
          onClick={handleClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
};