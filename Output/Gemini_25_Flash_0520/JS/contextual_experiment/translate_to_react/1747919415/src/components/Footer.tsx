import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { clearCompletedTodos, setFilter } from '../features/todos/todosSlice';
import { TodoFilter } from '../types';

const Footer: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const currentFilter = useSelector((state: RootState) => state.todos.filter);

  const remainingCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.length - remainingCount;

  const handleClearCompleted = () => {
    dispatch(clearCompletedTodos());
  };

  const handleFilterChange = (filter: TodoFilter) => {
    dispatch(setFilter(filter));
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
