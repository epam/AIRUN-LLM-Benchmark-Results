```tsx
import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import {
  selectActiveCount,
  selectCompletedCount,
  selectFilter,
  setFilter,
  clearCompleted
} from './todosSlice';

export function TodoFooter() {
  const dispatch = useAppDispatch();
  const remainingCount = useAppSelector(selectActiveCount);
  const completedCount = useAppSelector(selectCompletedCount);
  const filter = useAppSelector(selectFilter);

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{remainingCount}</strong> {remainingCount === 1 ? "item left" : "items left"}
      </span>
      <ul className="filters">
        <li>
          <a
            className={filter === 'all' ? 'selected' : ''}
            onClick={() => dispatch(setFilter('all'))}
          >
            All
          </a>
        </li>
        <li>
          <a
            className={filter === 'active' ? 'selected' : ''}
            onClick={() => dispatch(setFilter('active'))}
          >
            Active
          </a>
        </li>
        <li>
          <a
            className={filter === 'completed' ? 'selected' : ''}
            onClick={() => dispatch(setFilter('completed'))}
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
}
```