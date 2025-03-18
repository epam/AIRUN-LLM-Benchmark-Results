```typescript
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../store/store';
import { clearCompleted } from '../store/todosSlice';

const Footer: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const remainingCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - remainingCount;

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  if (todos.length === 0) {
    return null;
  }

  const itemWord = remainingCount === 1 ? 'item' : 'items';

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{remainingCount}</strong> {itemWord} left
      </span>
      <ul className="filters">
        <li>
          <Link to="/" className={window.location.pathname === '/' ? 'selected' : ''}>All</Link>
        </li>
        <li>
          <Link to="/active" className={window.location.pathname === '/active' ? 'selected' : ''}>Active</Link>
        </li>
        <li>
          <Link to="/completed" className={window.location.pathname === '/completed' ? 'selected' : ''}>Completed</Link>
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

export default Footer;
```