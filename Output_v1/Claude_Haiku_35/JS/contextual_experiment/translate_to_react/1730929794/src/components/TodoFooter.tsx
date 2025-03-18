import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { clearCompleted, setFilter } from '../store/todoSlice';

const TodoFooter: React.FC = () => {
  const dispatch = useDispatch();
  const { todos, filter } = useSelector((state: RootState) => state.todos);
  const remainingCount = todos.filter(todo => !todo.completed).length;

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  const handleFilterChange = (newFilter: string) => {
    dispatch(setFilter(newFilter));
  };

  if (todos.length === 0) return null;

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{remainingCount}</strong> {remainingCount === 1 ? 'item' : 'items'} left
      </span>
      <ul className="filters">
        <li>
          <a
            href="#/"
            className={filter === 'all' ? 'selected' : ''}
            onClick={() => handleFilterChange('all')}
          >
            All
          </a>
        </li>
        <li>
          <a
            href="#/active"
            className={filter === 'active' ? 'selected' : ''}
            onClick={() => handleFilterChange('active')}
          >
            Active
          </a>
        </li>
        <li>
          <a
            href="#/completed"
            className={filter === 'completed' ? 'selected' : ''}
            onClick={() => handleFilterChange('completed')}
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