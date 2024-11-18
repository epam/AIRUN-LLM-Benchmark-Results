```typescript
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import FilterButton from './FilterButton';
import { clearCompleted } from '../slices/todosSlice';

const Footer: React.FC = () => {
  const todos = useSelector((state: RootState) => state.todos.todos);
  const remainingCount = todos.filter((todo) => !todo.completed).length;
  const dispatch = useDispatch();

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  if (!todos.length) {
    return null;
  }

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{remainingCount}</strong> item{remainingCount !== 1 && 's'} left
      </span>
      <ul className="filters">
        <FilterButton filter="all">All</FilterButton>
        <FilterButton filter="active">Active</FilterButton>
        <FilterButton filter="completed">Completed</FilterButton>
      </ul>
      {remainingCount < todos.length && (
        <button className="clear-completed" onClick={handleClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default Footer;

```