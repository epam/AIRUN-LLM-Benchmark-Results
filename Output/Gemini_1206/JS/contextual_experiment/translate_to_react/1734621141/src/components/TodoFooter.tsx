import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { clearCompleted } from '../slices/todoSlice';
import { Filter } from '../types';

interface Props {
  activeFilter: Filter;
  onFilterChange: (filter: Filter) => void;
}

const TodoFooter: React.FC<Props> = ({ activeFilter, onFilterChange }) => {
  const dispatch = useDispatch();
  const remainingCount = useSelector(
    (state: RootState) => state.todos.filter((todo) => !todo.completed).length
  );
  const doneCount = useSelector((state: RootState) => state.todos.length - remainingCount);

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{remainingCount}</strong> {remainingCount === 1 ? 'item' : 'items'} left
      </span>
      <ul className="filters">
        <li>
          <a
            href="#/"
            className={activeFilter === 'all' ? 'selected' : ''}
            onClick={() => onFilterChange('all')}
          >
            All
          </a>
        </li>
        <li>
          <a
            href="#/active"
            className={activeFilter === 'active' ? 'selected' : ''}
            onClick={() => onFilterChange('active')}
          >
            Active
          </a>
        </li>
        <li>
          <a
            href="#/completed"
            className={activeFilter === 'completed' ? 'selected' : ''}
            onClick={() => onFilterChange('completed')}
          >
            Completed
          </a>
        </li>
      </ul>
      {doneCount > 0 && (
        <button className="clear-completed" onClick={handleClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default TodoFooter;
