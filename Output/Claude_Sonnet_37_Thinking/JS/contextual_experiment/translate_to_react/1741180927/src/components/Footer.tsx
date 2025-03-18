import React from 'react';
import { useAppSelector, useAppDispatch } from '../store';
import { setFilter, clearCompleted } from '../store/todosSlice';
import { FilterStatus } from '../types';

const Footer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { todos, status } = useAppSelector((state) => state.todos);
  
  const remainingCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - remainingCount;
  
  if (todos.length === 0) {
    return null;
  }
  
  const pluralize = (count: number) => {
    return count === 1 ? 'item' : 'items';
  };
  
  const handleFilterChange = (newFilter: FilterStatus) => {
    dispatch(setFilter(newFilter));
  };
  
  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };
  
  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{remainingCount}</strong> {pluralize(remainingCount)} left
      </span>
      <ul className="filters">
        <li>
          <a 
            href="#/" 
            className={status === 'all' ? 'selected' : ''}
            onClick={() => handleFilterChange('all')}
          >
            All
          </a>
        </li>
        <li>
          <a 
            href="#/active" 
            className={status === 'active' ? 'selected' : ''}
            onClick={() => handleFilterChange('active')}
          >
            Active
          </a>
        </li>
        <li>
          <a 
            href="#/completed" 
            className={status === 'completed' ? 'selected' : ''}
            onClick={() => handleFilterChange('completed')}
          >
            Completed
          </a>
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
};

export default Footer;
