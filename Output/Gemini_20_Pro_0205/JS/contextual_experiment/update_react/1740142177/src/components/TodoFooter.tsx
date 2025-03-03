import React from 'react';
import classNames from 'classnames';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { clearCompleted } from '../store/todoSlice';

interface TodoFooterProps {
  nowShowing: string;
  onFilterChange: (filter: string) => void;
}

const TodoFooter: React.FC<TodoFooterProps> = ({ nowShowing, onFilterChange }) => {
  const dispatch = useAppDispatch();
  const todos = useAppSelector(state => state.todos);
  const activeTodoCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeTodoCount;
  const activeTodoWord = activeTodoCount === 1 ? 'item' : 'items';

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeTodoCount}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <a
            href="#/"
            className={classNames({ selected: nowShowing === 'all' })}
            onClick={() => onFilterChange('all')}
          >
            All
          </a>
        </li>
        {' '}
        <li>
          <a
            href="#/active"
            className={classNames({ selected: nowShowing === 'active' })}
            onClick={() => onFilterChange('active')}
          >
            Active
          </a>
        </li>
        {' '}
        <li>
          <a
            href="#/completed"
            className={classNames({ selected: nowShowing === 'completed' })}
            onClick={() => onFilterChange('completed')}
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
