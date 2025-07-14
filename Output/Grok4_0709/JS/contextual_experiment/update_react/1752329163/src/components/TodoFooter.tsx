import React from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { clearCompleted } from '../store/todosSlice';

interface TodoFooterProps {
  count: number;
  completedCount: number;
  nowShowing: string;
}

const ALL_TODOS = 'all';
const ACTIVE_TODOS = 'active';
const COMPLETED_TODOS = 'completed';

const TodoFooter: React.FC<TodoFooterProps> = ({ count, completedCount, nowShowing }) => {
  const dispatch = useDispatch<AppDispatch>();
  const activeTodoWord = count === 1 ? 'item' : 'items';
  const handleClear = () => {
    dispatch(clearCompleted());
  };

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{count}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <a href="#/" className={classNames({ selected: nowShowing === ALL_TODOS })}>
            All
          </a>
        </li>
        {' '}
        <li>
          <a href="#/active" className={classNames({ selected: nowShowing === ACTIVE_TODOS })}>
            Active
          </a>
        </li>
        {' '}
        <li>
          <a href="#/completed" className={classNames({ selected: nowShowing === COMPLETED_TODOS })}>
            Completed
          </a>
        </li>
      </ul>
      {completedCount > 0 && (
        <button className="clear-completed" onClick={handleClear}>
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default TodoFooter;