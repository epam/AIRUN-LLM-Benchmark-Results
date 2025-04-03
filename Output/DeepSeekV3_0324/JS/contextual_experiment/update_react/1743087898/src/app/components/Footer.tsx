import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, FilterType } from '../constants';
import { pluralize } from '../utils';

interface FooterProps {
  count: number;
  completedCount: number;
  nowShowing: FilterType;
  onClearCompleted: () => void;
}

export const Footer = ({ count, completedCount, nowShowing, onClearCompleted }: FooterProps) => {
  const activeTodoWord = pluralize(count, 'item');
  
  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{count}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <a
            href="#/"
            className={nowShowing === ALL_TODOS ? 'selected' : ''}
          >
            All
          </a>
        </li>
        {' '}
        <li>
          <a
            href="#/active"
            className={nowShowing === ACTIVE_TODOS ? 'selected' : ''}
          >
            Active
          </a>
        </li>
        {' '}
        <li>
          <a
            href="#/completed"
            className={nowShowing === COMPLETED_TODOS ? 'selected' : ''}
          >
            Completed
          </a>
        </li>
      </ul>
      {completedCount > 0 && (
        <button
          className="clear-completed"
          onClick={onClearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};