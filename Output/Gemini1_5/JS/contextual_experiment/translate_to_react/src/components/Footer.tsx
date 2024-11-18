```tsx
import React from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import {
  clearCompletedTodos,
  toggleAllTodos,
} from '../store/todos/todosSlice';
import { Link, useLocation } from 'react-router-dom';
import { FilterValues } from '../types';

const Footer: React.FC = () => {
  const todos = useAppSelector((state) => state.todos.todos);
  const dispatch = useAppDispatch();
  const location = useLocation();

  const remainingCount = todos.filter((todo) => !todo.completed).length;

  const handleClearCompleted = () => {
    dispatch(clearCompletedTodos());
  };

  const handleToggleAll = () => {
    dispatch(toggleAllTodos(remainingCount > 0));
  };

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{remainingCount}</strong>{' '}
        {remainingCount === 1 ? 'item' : 'items'} left
      </span>
      <ul className="filters">
        {[
          [FilterValues.All, ''],
          [FilterValues.Active, '/active'],
          [FilterValues.Completed, '/completed'],
        ].map(([filter, path]) => (
          <li key={filter}>
            <Link
              to={path}
              className={location.pathname === path ? 'selected' : ''}
            >
              {filter}
            </Link>
          </li>
        ))}
      </ul>
      {todos.length - remainingCount > 0 && (
        <button className="clear-completed" onClick={handleClearCompleted}>
          Clear completed
        </button>
      )}
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        checked={remainingCount === 0}
        onChange={handleToggleAll}
      />
      <label htmlFor="toggle-all">Mark all as complete</label>
    </footer>
  );
};

export default Footer;

```