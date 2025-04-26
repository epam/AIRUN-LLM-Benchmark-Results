import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../store/filterSlice';
import { RootState } from '../store/store';
import { TodoFilter } from '../types';

const FilterLinks: React.FC = () => {
  const dispatch = useDispatch();
  const currentFilter = useSelector((state: RootState) => state.filter);

  const handleFilterChange = (filter: TodoFilter) => {
    dispatch(setFilter(filter));
  };

  return (
    <ul className="filters">
      <li>
        <a
          href="#/"
          className={currentFilter === 'all' ? 'selected' : ''}
          onClick={() => handleFilterChange('all')}
        >
          All
        </a>
      </li>
      <li>
        <a
          href="#/active"
          className={currentFilter === 'active' ? 'selected' : ''}
          onClick={() => handleFilterChange('active')}
        >
          Active
        </a>
      </li>
      <li>
        <a
          href="#/completed"
          className={currentFilter === 'completed' ? 'selected' : ''}
          onClick={() => handleFilterChange('completed')}
        >
          Completed
        </a>
      </li>
    </ul>
  );
};

export default FilterLinks;
