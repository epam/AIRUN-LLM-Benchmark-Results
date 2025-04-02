import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { RootState } from '../store/store';
import { clearCompleted } from '../store/todoSlice';

const Footer: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todo.todos);
  const remainingCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - remainingCount;

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  if (todos.length === 0) {
    return null;
  }

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{remainingCount}</strong> {remainingCount === 1 ? 'item left' : 'items left'}
      </span>
      <ul className="filters">
        <li>
          <NavLink exact to="/" activeClassName="selected">All</NavLink>
        </li>
        <li>
          <NavLink to="/active" activeClassName="selected">Active</NavLink>
        </li>
        <li>
          <NavLink to="/completed" activeClassName="selected">Completed</NavLink>
        </li>
      </ul>
      {completedCount > 0 && (
        <button className="clear-completed" onClick={handleClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default Footer;
