```typescript
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../slices/todosSlice';
import { RootState } from '../store';

interface FilterButtonProps {
  filter: 'all' | 'active' | 'completed';
  children: React.ReactNode;
}

const FilterButton: React.FC<FilterButtonProps> = ({ filter, children }) => {
  const dispatch = useDispatch();
  const currentFilter = useSelector((state: RootState) => state.todos.filter);

  const handleClick = () => {
    dispatch(setFilter(filter));
  };

  return (
    <li>
      <button className={currentFilter === filter ? 'selected' : ''} onClick={handleClick}>
        {children}
      </button>
    </li>
  );
};

export default FilterButton;

```