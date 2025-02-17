```ts
import React from 'react';

export type FilterType = 'all' | 'active' | 'completed';

interface TodoFiltersProps {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
}

const TodoFilters: React.FC<TodoFiltersProps> = ({ filter, setFilter }) => {
  return (
    <ul className="filters">
      <li>
        <a
          className={filter === 'all' ? 'selected' : ''}
          href="#/"
          onClick={(e) => { e.preventDefault(); setFilter('all'); }}
        >
          All
        </a>
      </li>
      <li>
        <a
          className={filter === 'active' ? 'selected' : ''}
          href="#/active"
          onClick={(e) => { e.preventDefault(); setFilter('active'); }}
        >
          Active
        </a>
      </li>
      <li>
        <a
          className={filter === 'completed' ? 'selected' : ''}
          href="#/completed"
          onClick={(e) => { e.preventDefault(); setFilter('completed'); }}
        >
          Completed
        </a>
      </li>
    </ul>
  );
};

export default TodoFilters;
```