import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCompleted } from '../store/todoSlice';
import { RootState } from '../store/store';

interface Props {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const TodoFooter: React.FC<Props> = ({ activeFilter, onFilterChange }) => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos);
  const remainingCount = todos.filter((todo) => !todo.completed).length;

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{remainingCount}</strong> {remainingCount === 1 ? 'item' : 'items'} left
      </span>
      <ul className="filters">
        <li>
          <a
            href="#/"
            className={activeFilter === 'all' ? 'selected' : ''}
            onClick={() => onFilterChange('all')}
          >
            All
          </a>
        </li>
        <li>
          <a
            href="#/active"
            className={activeFilter === 'active' ? 'selected' : ''}
            onClick={() => onFilterChange('active')}
          >
            Active
          </a>
        </li>
        <li>
          <a
            href="#/completed"
            className={activeFilter === 'completed' ? 'selected' : ''}
            onClick={() => onFilterChange('completed')}
          >
            Completed
          </a>
        </li>
      </ul>
      {remainingCount < todos.length && (
        <button className="clear-completed" onClick={handleClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default TodoFooter;