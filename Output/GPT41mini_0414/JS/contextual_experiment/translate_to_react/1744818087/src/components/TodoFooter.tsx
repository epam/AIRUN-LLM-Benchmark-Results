import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setFilter, clearCompleted } from '../store/todosSlice';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
] as const;

type FilterKey = typeof FILTERS[number]['key'];

export const TodoFooter: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const filter = useSelector((state: RootState) => state.todos.filter);

  const remainingCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - remainingCount;

  const onFilterChange = (key: FilterKey) => {
    dispatch(setFilter(key));
  };

  const onClearCompleted = () => {
    dispatch(clearCompleted());
  };

  if (todos.length === 0) return null;

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{remainingCount}</strong> {remainingCount === 1 ? 'item left' : 'items left'}
      </span>
      <ul className="filters">
        {FILTERS.map(({ key, label }) => (
          <li key={key}>
            <a
              href={`#/${key === 'all' ? '' : key}`}
              className={filter === key ? 'selected' : ''}
              onClick={e => {
                e.preventDefault();
                onFilterChange(key);
              }}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
      {completedCount > 0 && (
        <button className="clear-completed" onClick={onClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
};
