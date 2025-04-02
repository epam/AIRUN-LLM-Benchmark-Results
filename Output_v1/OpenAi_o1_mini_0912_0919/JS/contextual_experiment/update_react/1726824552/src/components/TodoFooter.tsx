```typescript
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';
import { pluralize } from '../utils/utils';
import { clearCompleted } from '../store/todosSlice';
import { RootState } from '../store/store';

const TodoFooter: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeCount;
  const nowShowing = 'all'; // This should come from the store or routing

  const activeTodoWord = pluralize(activeCount, 'item');

  let clearButton = null;
  if (completedCount > 0) {
    clearButton = (
      <button
        className="clear-completed"
        onClick={() => dispatch(clearCompleted())}
      >
        Clear completed
      </button>
    );
  }

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeCount}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <a
            href="#/"
            className={classNames({ selected: nowShowing === ALL_TODOS })}
          >
            All
          </a>
        </li>
        {' '}
        <li>
          <a
            href="#/active"
            className={classNames({ selected: nowShowing === ACTIVE_TODOS })}
          >
            Active
          </a>
        </li>
        {' '}
        <li>
          <a
            href="#/completed"
            className={classNames({ selected: nowShowing === COMPLETED_TODOS })}
          >
            Completed
          </a>
        </li>
      </ul>
      {clearButton}
    </footer>
  );
};

export default TodoFooter;
```