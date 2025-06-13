import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCompletedTodos, toggleAllTodos } from '../store/todoSlice';
import { RootState } from '../store/store';

function TodoFooter() {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const remainingCount = useSelector((state: RootState) => state.todos.remainingCount);

  const handleClearCompleted = () => {
    dispatch(clearCompletedTodos());
  };

  const handleToggleAll = () => {
    dispatch(toggleAllTodos());
  };

  return (
    <footer className="footer" style={{ display: todos.length ? 'block' : 'none' }}>
      <span className="todo-count">
        <strong>{remainingCount}</strong> item{remainingCount !== 1 ? 's' : ''} left
      </span>
      <ul className="filters">
        <li>
          <a href="#/" className={remainingCount === todos.length ? 'selected' : ''}>All</a>
        </li>
        <li>
          <a href="#/active" className={remainingCount === 0 ? 'selected' : ''}>Active</a>
        </li>
        <li>
          <a href="#/completed" className={remainingCount < todos.length ? 'selected' : ''}>Completed</a>
        </li>
      </ul>
      <button className="clear-completed" onClick={handleClearCompleted} style={{ display: remainingCount < todos.length ? 'block' : 'none' }}>
        Clear completed
      </button>
    </footer>
  );
}

export default TodoFooter;