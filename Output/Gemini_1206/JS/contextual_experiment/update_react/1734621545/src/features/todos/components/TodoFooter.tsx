import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCompletedTodos, setFilter, FilterType } from '../todosSlice';
import { RootState } from '../../../store';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';

const TodoFooter: React.FC = () => {
  const dispatch = useDispatch();
  const activeCount = useSelector(
    (state: RootState) => state.todos.todos.filter((todo) => !todo.completed).length
  );
  const completedCount = useSelector(
    (state: RootState) => state.todos.todos.filter((todo) => todo.completed).length
  );
  const currentFilter = useSelector((state: RootState) => state.todos.filter);

  const handleClearCompleted = () => {
    dispatch(clearCompletedTodos());
  };

  const handleFilterChange = (filter: FilterType) => {
    dispatch(setFilter(filter));
  };

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeCount}</strong> item{activeCount === 1 ? '' : 's'} left
      </span>
      <ul className="filters">
        <li>
          <a
            href="#/"
            className={currentFilter === ALL_TODOS ? 'selected' : ''}
            onClick={() => handleFilterChange(ALL_TODOS)}
          >
            All
          </a>
        </li>
        <li>
          <a
            href="#/active"
            className={currentFilter === ACTIVE_TODOS ? 'selected' : ''}
            onClick={() => handleFilterChange(ACTIVE_TODOS)}
          >
            Active
          </a>
        </li>
        <li>
          <a
            href="#/completed"
            className={currentFilter === COMPLETED_TODOS ? 'selected' : ''}
            onClick={() => handleFilterChange(COMPLETED_TODOS)}
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
