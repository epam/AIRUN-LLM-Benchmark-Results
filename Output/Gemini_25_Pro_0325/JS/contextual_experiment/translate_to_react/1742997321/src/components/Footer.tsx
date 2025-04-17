import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { setFilter, clearCompleted } from '../store/todosSlice';
import { FilterStatus } from '../types';

const Footer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const currentFilter = useSelector((state: RootState) => state.todos.filter);

  const remainingCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - remainingCount;

  const handleFilterChange = (filter: FilterStatus) => {
    dispatch(setFilter(filter));
  };

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  if (todos.length === 0) {
    return null;
  }

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{remainingCount}</strong> {remainingCount === 1 ? 'item' : 'items'} left
      </span>
      <ul className="filters">
        <li>
          <a
            href="#/"
            className={currentFilter === 'all' ? 'selected' : ''}
            onClick={() => handleFilterChange('all')}
          >
            All
          </a>
        </li>
        <li>
          <a
            href="#/active"
            className={currentFilter === 'active' ? 'selected' : ''}
            onClick={() => handleFilterChange('active')}
          >
            Active
          </a>
        </li>
        <li>
          <a
            href="#/completed"
            className={currentFilter === 'completed' ? 'selected' : ''}
            onClick={() => handleFilterChange('completed')}
          >
            Completed
          </a>
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
