import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { clearCompleted, setFilter } from '../store/todoSlice';
import { FilterType } from '../types/todo';

interface TodoFooterProps {
  currentFilter: FilterType;
}

export const TodoFooter: React.FC<TodoFooterProps> = ({ currentFilter }) => {
  const dispatch = useDispatch();
  const { todos } = useSelector((state: RootState) => state.todos);
  
  const remainingCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - remainingCount;
  const hasCompletedTodos = completedCount > 0;

  const handleFilterChange = (filter: FilterType) => {
    dispatch(setFilter(filter));
  };

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  const pluralize = (count: number) => {
    return count === 1 ? 'item' : 'items';
  };

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{remainingCount}</strong> {pluralize(remainingCount)} left
      </span>
      <ul className="filters">
        <li>
          <a 
            className={currentFilter === 'all' ? 'selected' : ''}
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              handleFilterChange('all');
            }}
          >
            All
          </a>
        </li>
        <li>
          <a 
            className={currentFilter === 'active' ? 'selected' : ''}
            href="#/active"
            onClick={(e) => {
              e.preventDefault();
              handleFilterChange('active');
            }}
          >
            Active
          </a>
        </li>
        <li>
          <a 
            className={currentFilter === 'completed' ? 'selected' : ''}
            href="#/completed"
            onClick={(e) => {
              e.preventDefault();
              handleFilterChange('completed');
            }}
          >
            Completed
          </a>
        </li>
      </ul>
      {hasCompletedTodos && (
        <button className="clear-completed" onClick={handleClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
};