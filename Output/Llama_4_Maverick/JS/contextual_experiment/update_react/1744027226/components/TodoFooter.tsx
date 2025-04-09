import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCompleted } from '../slices/todosSlice';
import { pluralize } from '../utils';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';

interface TodoFooterProps {
  nowShowing: string;
}

const TodoFooter: React.FC<TodoFooterProps> = ({ nowShowing }) => {
  const dispatch = useDispatch();
  const todos = useSelector((state: any) => state.todos);
  const activeCount = todos.filter((todo: any) => !todo.completed).length;
  const completedCount = todos.length - activeCount;

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeCount}</strong> {pluralize(activeCount, 'item')} left
      </span>
      <ul className="filters">
        <li>
          <a href="#/" className={nowShowing === ALL_TODOS ? 'selected' : ''}>
            All
          </a>
        </li>
        {' '}
        <li>
          <a href="#/active" className={nowShowing === ACTIVE_TODOS ? 'selected' : ''}>
            Active
          </a>
        </li>
        {' '}
        <li>
          <a href="#/completed" className={nowShowing === COMPLETED_TODOS ? 'selected' : ''}>
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