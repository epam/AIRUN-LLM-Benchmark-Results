```typescript
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCompleted } from '../store/todosSlice';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';
import { pluralize } from '../utils/utils';
import { RootState } from '../store';

export const TodoFooter: React.FC = () => {
  const dispatch = useDispatch();
  const { todos, nowShowing } = useSelector((state: RootState) => ({
    todos: state.todos,
    nowShowing: state.visibilityFilter
  }));

  const activeTodoCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeTodoCount;

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeTodoCount}</strong> {pluralize(activeTodoCount, 'item')} left
      </span>
      <ul className="filters">
        <li>
          <a href="#" className={nowShowing === ALL_TODOS ? 'selected' : ''}>All</a>
        </li>
        <li>
          <a href="#/active" className={nowShowing === ACTIVE_TODOS ? 'selected' : ''}>Active</a>
        </li>
        <li>
          <a href="#/completed" className={nowShowing === COMPLETED_TODOS ? 'selected' : ''}>Completed</a>
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
```