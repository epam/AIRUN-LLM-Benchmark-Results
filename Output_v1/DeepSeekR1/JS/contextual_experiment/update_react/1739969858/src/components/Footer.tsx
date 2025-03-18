import classNames from 'classnames';
import { pluralize } from '../utils/store';
import { FooterProps } from '../app/types';

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
            className={classNames({ selected: nowShowing === 'all' })}
          >
            All
          </a>
        </li>
        <li>
          <a
            href="#/active"
            className={classNames({ selected: nowShowing === 'active' })}
          >
            Active
          </a>
        </li>
        <li>
          <a
            href="#/completed"
            className={classNames({ selected: nowShowing === 'completed' })}
          >
            Completed
          </a>
        </li>
      </ul>
      {completedCount > 0 && (
        <button className="clear-completed" onClick={onClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
};
