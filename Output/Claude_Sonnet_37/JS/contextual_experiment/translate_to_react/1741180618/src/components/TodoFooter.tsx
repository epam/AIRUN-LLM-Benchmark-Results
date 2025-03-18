import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCompleted, setStatus } from '../store/todoSlice';
import { RootState } from '../store/store';

const TodoFooter: React.FC = () => {
  const dispatch = useDispatch();
  const { todos, status } = useSelector((state: RootState) => state.todos);
  
  const remainingCount = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.length > remainingCount;

  if (todos.length === 0) {
    return null;
  }

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{remainingCount}</strong> {remainingCount === 1 ? 'item' : 'items'} left
      </span>
      <ul className="filters">
        <li>
          <a 
            href="#/" 
            className={status === 'all' ? 'selected' : ''}
            onClick={() => dispatch(setStatus('all'))}
          >
            All
          </a>
        </li>
        <li>
          <a 
            href="#/active" 
            className={status === 'active' ? 'selected' : ''}
            onClick={() => dispatch(setStatus('active'))}
          >
            Active
          </a>
        </li>
        <li>
          <a 
            href="#/completed" 
            className={status === 'completed' ? 'selected' : ''}
            onClick={() => dispatch(setStatus('completed'))}
          >
            Completed
          </a>
        </li>
      </ul>
      {hasCompleted && (
        <button 
          className="clear-completed" 
          onClick={() => dispatch(clearCompleted())}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default TodoFooter;