import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { clearCompleted, setFilter } from '../store/todoSlice';
import { FilterType } from '../types/todo';

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const filter = useSelector((state: RootState) => state.todos.filter);
  
  const remainingCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  if (todos.length === 0) {
    return null;
  }

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  const handleFilterChange = (newFilter: FilterType) => {
    dispatch(setFilter(newFilter));
  };

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{remainingCount}</strong>
        <span> {remainingCount === 1 ? 'item' : 'items'} left</span>
      </span>
      <ul className="filters">
        <li>
          <a 
            className={filter === 'all' ? 'selected' : ''} 
            href="#/"
            onClick={(e) => { e.preventDefault(); handleFilterChange('all'); }}
          >
            All
          </a>
        </li>
        <li>
          <a 
            className={filter === 'active' ? 'selected' : ''} 
            href="#/active"
            onClick={(e) => { e.preventDefault(); handleFilterChange('active'); }}
          >
            Active
          </a>
        </li>
        <li>
          <a 
            className={filter === 'completed' ? 'selected' : ''} 
            href="#/completed"
            onClick={(e) => { e.preventDefault(); handleFilterChange('completed'); }}
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