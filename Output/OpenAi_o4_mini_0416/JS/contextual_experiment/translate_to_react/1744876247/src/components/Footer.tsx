```tsx
import React from 'react';
import { useAppSelector, useAppDispatch } from '../store';
import { clearCompleted, setFilter } from '../store/todosSlice';
import { Filter } from '../types';

const Footer: React.FC = () => {
  const dispatch = useAppDispatch();
  const todos = useAppSelector((state) => state.todos.todos);
  const remainingCount = todos.filter((todo) => !todo.completed).length;
  const filtered = useAppSelector((state) => state.todos.filter);
  const completedCount = todos.length - remainingCount;

  const handleFilter = (filter: Filter) => (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(setFilter(filter));
  };

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{remainingCount}</strong> {remainingCount === 1 ? 'item left' : 'items left'}
      </span>
      <ul className="filters">
        <li>
          <a href="#" className={filtered === 'all' ? 'selected' : ''} onClick={handleFilter('all')}>
            All
          </a>
        </li>
        <li>
          <a href="#" className={filtered === 'active' ? 'selected' : ''} onClick={handleFilter('active')}>
            Active
          </a>
        </li>
        <li>
          <a href="#" className={filtered === 'completed' ? 'selected' : ''} onClick={handleFilter('completed')}>
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

export default Footer;
```