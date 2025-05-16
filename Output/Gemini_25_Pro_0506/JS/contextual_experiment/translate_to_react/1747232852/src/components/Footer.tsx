import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { clearCompletedTodos, setFilter } from '../features/todos/todosSlice';
import { FilterStatus } from '../features/todos/types';

const Footer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const currentFilter = useSelector((state: RootState) => state.todos.filter);

  const remainingCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - remainingCount;

  const handleSetFilter = (filter: FilterStatus) => {
    dispatch(setFilter(filter));
  };

  const handleClearCompleted = () => {
    dispatch(clearCompletedTodos());
  };

  if (todos.length === 0) {
    return null;
  }

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{remainingCount}</strong>
        {remainingCount === 1 ? ' item' : ' items'} left
      </span>
      <ul className="filters">
        <li>
          <a
            href="#/"
            className={currentFilter === FilterStatus.All ? 'selected' : ''}
            onClick={() => handleSetFilter(FilterStatus.All)}
          >
            All
          </a>
        </li>
        <li>
          <a
            href="#/active"
            className={currentFilter === FilterStatus.Active ? 'selected' : ''}
            onClick={() => handleSetFilter(FilterStatus.Active)}
          >
            Active
          </a>
        </li>
        <li>
          <a
            href="#/completed"
            className={currentFilter === FilterStatus.Completed ? 'selected' : ''}
            onClick={() => handleSetFilter(FilterStatus.Completed)}
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
