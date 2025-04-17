import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { statusFilterChanged, StatusFilters } from '../features/filters/filtersSlice';
import { clearCompleted, selectActiveTodosCount, selectCompletedTodosCount } from '../features/todos/todosSlice';
import { pluralize } from '../utils/pluralize';

const Footer: React.FC = () => {
  const dispatch = useDispatch();
  const activeTodoCount = useSelector(selectActiveTodosCount);
  const completedCount = useSelector(selectCompletedTodosCount);
  const currentFilter = useSelector((state: RootState) => state.filters.status);

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  const handleFilterChange = (filter: StatusFilters) => {
    dispatch(statusFilterChanged(filter));
  };

  const activeTodoWord = pluralize(activeTodoCount, 'item');

  const renderFilterLink = (filter: StatusFilters, text: string) => {
    const selected = currentFilter === filter;
    return (
      <li>
        <a
          href="#"
          className={selected ? 'selected' : ''}
          onClick={(e) => {
            e.preventDefault();
            handleFilterChange(filter);
          }}
        >
          {text}
        </a>
      </li>
    );
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
        {renderFilterLink(StatusFilters.All, 'All')}
        {' '}
        {renderFilterLink(StatusFilters.Active, 'Active')}
        {' '}
        {renderFilterLink(StatusFilters.Completed, 'Completed')}
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
};

export default Footer;
