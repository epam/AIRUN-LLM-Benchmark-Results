import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { clearCompleted, setFilter } from '../store/todoSlice';
import { FilterType } from '../types';

const TodoFooter: React.FC = () => {
  const todos = useSelector((state: RootState) => state.todos.todos);
  const currentFilter = useSelector((state: RootState) => state.todos.filter);
  const dispatch = useDispatch();

  const remainingCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - remainingCount;

  const handleFilterChange = (filter: FilterType) => {
    dispatch(setFilter(filter));
  };

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  if (todos.length === 0) return null;

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{remainingCount}</strong> {remainingCount === 1 ? 'item left' : 'items left'}
      </span>
      <ul className="filters">
        <li>
          <a
            className={currentFilter === 'all' ? 'selected' : ''}
            href="#/"
            onClick={() => handleFilterChange('all')}
          >
            All
          </a>
        </li>
        <li>
          <a
            className={currentFilter === 'active' ? 'selected' : ''}
            href="#/active"
            onClick={() => handleFilterChange('active')}
          >
            Active
          </a>
        </li>
        <li>
          <a
            className={currentFilter === 'completed' ? 'selected' : ''}
            href="#/completed"
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

export default TodoFooter;