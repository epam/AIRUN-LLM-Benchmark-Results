import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCompleted, setFilter } from '../features/todos/todosSlice';
import { RootState } from '../store';
import { Filter } from '../types';

const TodoFooter: React.FC = () => {
  const dispatch = useDispatch();
  const { items, filter } = useSelector((state: RootState) => state.todos);

  if (items.length === 0) {
    return null;
  }

  const remainingCount = items.filter((todo) => !todo.completed).length;
  const completedCount = items.length - remainingCount;

  const filters: { label: string; value: Filter; href: string }[] = [
    { label: 'All', value: 'all', href: '#/' },
    { label: 'Active', value: 'active', href: '#/active' },
    { label: 'Completed', value: 'completed', href: '#/completed' },
  ];

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{remainingCount}</strong> {remainingCount === 1 ? 'item' : 'items'} left
      </span>
      <ul className="filters">
        {filters.map(({ label, value, href }) => (
          <li key={value}>
            <a
              href={href}
              className={filter === value ? 'selected' : ''}
              onClick={(e) => {
                e.preventDefault();
                dispatch(setFilter(value));
              }}
            >
              {label}
            </a>
          </li>
        ))}
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
