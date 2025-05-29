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
  const { todos, remainingCount } = useSelector((state: RootState) => ({
    todos: state.todos.todos,
    remainingCount: state.todos.todos.filter(todo => !todo.completed).length
  }));

  const completedCount = todos.length - remainingCount;
  const itemText = remainingCount === 1 ? 'item left' : 'items left';

  const handleFilterClick = (filter: FilterType) => {
    dispatch(setFilter(filter));
  };

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  if (todos.length === 0) {
    return null;
  }

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{remainingCount}</strong> {itemText}
      </span>
      <ul className="filters">
        <li>
          <a
            className={currentFilter === 'all' ? 'selected' : ''}
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              handleFilterClick('all');
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
              handleFilterClick('active');
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
              handleFilterClick('completed');
            }}
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
