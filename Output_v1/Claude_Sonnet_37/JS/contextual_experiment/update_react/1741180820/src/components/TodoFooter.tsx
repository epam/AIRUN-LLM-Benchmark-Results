import React from 'react';
import classNames from 'classnames';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../store';
import { clearCompleted } from '../store/todoSlice';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';

interface TodoFooterProps {
  activeTodoCount: number;
  completedCount: number;
}

const TodoFooter: React.FC<TodoFooterProps> = ({ activeTodoCount, completedCount }) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { pathname } = location;
  
  const activeTodoWord = activeTodoCount === 1 ? 'item' : 'items';
  
  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeTodoCount}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <NavLink 
            to="/"
            className={({ isActive }) => classNames({ selected: isActive || pathname === '/' })}
            end
          >
            All
          </NavLink>
        </li>
        {' '}
        <li>
          <NavLink 
            to="/active"
            className={({ isActive }) => classNames({ selected: isActive })}
          >
            Active
          </NavLink>
        </li>
        {' '}
        <li>
          <NavLink 
            to="/completed"
            className={({ isActive }) => classNames({ selected: isActive })}
          >
            Completed
          </NavLink>
        </li>
      </ul>
      {completedCount > 0 && (
        <button
          className="clear-completed"
          onClick={handleClearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default TodoFooter;