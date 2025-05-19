import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCompleted, selectCompletedCount, selectActiveCount } from '../features/todos/todoSlice';
import { setFilter, selectFilter } from '../features/filter/filterSlice';
import { pluralize } from '../utils/localStorage';

const TodoFooter = () => {
  const dispatch = useDispatch();
  const completedCount = useSelector(selectCompletedCount);
  const activeCount = useSelector(selectActiveCount);
  const filter = useSelector(selectFilter);

  const activeTodoWord = pluralize(activeCount, 'item');

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeCount}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <a
            href="#/"
            className={filter === 'all' ? 'selected' : ''}
            onClick={() => dispatch(setFilter('all'))}
          >
            All
          </a>
        </li>
        <li>
          <a
            href="#/active"
            className={filter === 'active' ? 'selected' : ''}
            onClick={() => dispatch(setFilter('active'))}
          >
            Active
          </a>
        </li>
        <li>
          <a
            href="#/completed"
            className={filter === 'completed' ? 'selected' : ''}
            onClick={() => dispatch(setFilter('completed'))}
          >
            Completed
          </a>
        </li>
      </ul>
      {completedCount > 0 && (
        <button className="clear-completed" onClick={() => dispatch(clearCompleted())}>
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default TodoFooter;