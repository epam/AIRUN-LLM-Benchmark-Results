import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { clearCompleted } from '../store/todoSlice';
import { FilterStatus } from '../types/todo';

interface TodoFooterProps {
  activeCount: number;
  filterStatus: FilterStatus;
  setFilterStatus: (status: FilterStatus) => void;
}

const TodoFooter: React.FC<TodoFooterProps> = ({ activeCount, filterStatus, setFilterStatus }) => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.list);

  const itemText = activeCount === 1 ? 'item' : 'items';

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeCount}</strong> {itemText} left
      </span>
      <ul className="filters">
        <li>
          <a
            href="#/"
            className={filterStatus === 'all' ? 'selected' : ''}
            onClick={() => setFilterStatus('all')}
          >
            All
          </a>
        </li>
        <li>
          <a
            href="#/active"
            className={filterStatus === 'active' ? 'selected' : ''}
            onClick={() => setFilterStatus('active')}
          >
            Active
          </a>
        </li>
        <li>
          <a
            href="#/completed"
            className={filterStatus === 'completed' ? 'selected' : ''}
            onClick={() => setFilterStatus('completed')}
          >
            Completed
          </a>
        </li>
      </ul>
      {todos.some(todo => todo.completed) && (
        <button className="clear-completed" onClick={handleClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default TodoFooter;
