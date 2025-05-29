import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import { RootState } from '../store';
import { clearCompleted } from '../todoSlice';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';
import { pluralize } from '../utils';

function TodoFooter() {
  const dispatch = useDispatch();
  const location = useLocation();
  const todos = useSelector((state: RootState) => state.todos.todos);

  const activeTodoCount = todos.reduce((accum, todo) => {
    return todo.completed ? accum : accum + 1;
  }, 0);

  const completedCount = todos.length - activeTodoCount;

  const getFilterType = () => {
    switch (location.pathname) {
      case '/active':
        return ACTIVE_TODOS;
      case '/completed':
        return COMPLETED_TODOS;
      default:
        return ALL_TODOS;
    }
  };

  const nowShowing = getFilterType();
  const activeTodoWord = pluralize(activeTodoCount, 'item');

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  if (activeTodoCount === 0 && completedCount === 0) {
    return null;
  }

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeTodoCount}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <Link
            to="/"
            className={nowShowing === ALL_TODOS ? 'selected' : ''}
          >
            All
          </Link>
        </li>
        {' '}
        <li>
          <Link
            to="/active"
            className={nowShowing === ACTIVE_TODOS ? 'selected' : ''}
          >
            Active
          </Link>
        </li>
        {' '}
        <li>
          <Link
            to="/completed"
            className={nowShowing === COMPLETED_TODOS ? 'selected' : ''}
          >
            Completed
          </Link>
        </li>
      </ul>
      {completedCount > 0 && (
        <button
          className="clear-completed"
          onClick={handleClearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
}

export default TodoFooter;