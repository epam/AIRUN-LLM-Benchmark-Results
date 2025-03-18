import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { clearCompleted, selectTodos } from './todosSlice';
import { Link, useLocation } from 'react-router-dom';

const TodoFooter: React.FC = () => {
  const dispatch = useAppDispatch();
  const todos = useAppSelector(selectTodos);
  const remainingCount = todos.filter(todo => !todo.completed).length;
  const location = useLocation();

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{remainingCount}</strong> {remainingCount === 1 ? 'item' : 'items'} left
      </span>
      <ul className="filters">
        <li>
          <Link to="/" className={location.pathname === '/' ? 'selected' : ''}>All</Link>
        </li>
        <li>
          <Link to="/active" className={location.pathname === '/active' ? 'selected' : ''}>Active</Link>
        </li>
        <li>
          <Link to="/completed" className={location.pathname === '/completed' ? 'selected' : ''}>Completed</Link>
        </li>
      </ul>
      {todos.some(todo => todo.completed) && (
        <button className="clear-completed" onClick={() => dispatch(clearCompleted())}>
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default TodoFooter;