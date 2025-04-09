import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { clearDoneTodos, setFilter } from '../store/todoSlice';

const TodoFooter: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const filter = useSelector((state: RootState) => state.todos.filter);
  const remainingCount = todos.filter((todo) => !todo.completed).length;

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{remainingCount}</strong> {remainingCount === 1 ? 'item' : 'items'} left
      </span>
      <ul className="filters">
        <li>
          <a
            href="#"
            className={filter === 'all' ? 'selected' : ''}
            onClick={() => dispatch(setFilter('all'))}
          >
            All
          </a>
        </li>
        <li>
          <a
            href="#"
            className={filter === 'active' ? 'selected' : ''}
            onClick={() => dispatch(setFilter('active'))}
          >
            Active
          </a>
        </li>
        <li>
          <a
            href="#"
            className={filter === 'completed' ? 'selected' : ''}
            onClick={() => dispatch(setFilter('completed'))}
          >
            Completed
          </a>
        </li>
      </ul>
      {todos.length > remainingCount && (
        <button className="clear-completed" onClick={() => dispatch(clearDoneTodos())}>
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default TodoFooter;